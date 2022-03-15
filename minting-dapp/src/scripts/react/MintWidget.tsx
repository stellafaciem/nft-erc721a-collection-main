import { ethers, utils, BigNumber } from "ethers";
import React from "react";
import CollectionConfig from "../../../../smart-contract/config/CollectionConfig";

interface Props {
  maxSupply: number;
  totalSupply: number;
  tokenPrice: BigNumber;
  maxMintAmountPerTx: number;
  isPaused: boolean;
  isWhitelistMintEnabled: boolean;
  isUserInWhitelist: boolean;
  mintTokens(mintAmount: number): Promise<void>;
  whitelistMintTokens(mintAmount: number): Promise<void>;
}

interface State {
  mintAmount: number;
  network: ethers.providers.Network | null;
  reload: boolean;
  mintFeedback: string | JSX.Element | null;
}

const defaultState: State = {
  mintAmount: 1,
  network: null,
  reload: false,
  mintFeedback: null,
};

export default class MintWidget extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = defaultState;
  }

  private canMint(): boolean {
    return !this.props.isPaused || this.canWhitelistMint();
  }

  private canWhitelistMint(): boolean {
    return this.props.isWhitelistMintEnabled && this.props.isUserInWhitelist;
  }

  private incrementMintAmount(): void {
    this.setState({
      mintAmount: Math.min(
        this.props.maxMintAmountPerTx,
        this.state.mintAmount + 1
      ),
    });
  }

  private decrementMintAmount(): void {
    this.setState({
      mintAmount: Math.max(1, this.state.mintAmount - 1),
    });
  }

  private async mint(): Promise<void> {
    if (!this.props.isPaused) {
      await this.props.mintTokens(this.state.mintAmount);

      return this.setState({
        mintFeedback: (
          <>
            <br />
            You are now the proud owner of a <strong>Stella Faciem NFT</strong>!
            <br />
            You will be able to see the NFT in your profile on{" "}
            <a href={this.generateOpenSeaUrl()} target="_blank">
              OpenSea
            </a>{" "}
            & Metamask.
            <br />
            <br />
            Or you can check it via this link:
            <br />
            <a href={this.generateNFTUrl()} target="_blank">
              https://opensea.io/assets/
              <br />
              (our_contract_address)/(your_tokenID*)
            </a>
            <br />
            <br />
            <strong>
              * change "your_tokenID" with your owned SF token ID.
            </strong>
          </>
        ),
      });
    }

    await this.props.whitelistMintTokens(this.state.mintAmount);

    return this.setState({
      mintFeedback: (
        <>
          <br />
          You are now the proud owner of a <strong>Stella Faciem NFT</strong>!
          <br />
          You will be able to see the NFT in your profile on{" "}
          <a href={this.generateOpenSeaUrl()} target="_blank">
            OpenSea
          </a>{" "}
          & Metamask.
          <br />
          <br />
          Or you can check it via this link:
          <br />
          <a href={this.generateNFTUrl()} target="_blank">
            https://opensea.io/assets/
            <br />
            (our_contract_address)/(your_tokenID)
          </a>
        </>
      ),
    });
  }

  render() {
    return (
      <>
        {this.state.mintFeedback ? (
          <div className="mintFeedback">
            <p>{this.state.mintFeedback}</p>
            <button onClick={() => this.closeMintFeedback()}>Close</button>
          </div>
        ) : null}
        {this.canMint() ? (
          <div className="mint-widget">
            <div className="price">
              <strong>Total price:</strong>{" "}
              {utils.formatEther(
                this.props.tokenPrice.mul(this.state.mintAmount)
              )}{" "}
              ETH
            </div>

            <div className="controls">
              <button
                className="decrease"
                onClick={() => this.decrementMintAmount()}
              >
                -
              </button>
              <span className="mint-amount">{this.state.mintAmount}</span>
              <button
                className="increase"
                onClick={() => this.incrementMintAmount()}
              >
                +
              </button>
              <button className="secondary" onClick={() => this.mint()}>
                Mint
              </button>
            </div>
          </div>
        ) : (
          <div className="cannot-mint">
            <span className="emoji">⏳</span>
            <br />
            {this.props.isWhitelistMintEnabled ? (
              <>
                You are not included in the <strong>whitelist</strong>.
              </>
            ) : (
              <>
                The contract is <strong>paused</strong>.
              </>
            )}
            <br />
            Please contact our representative to get information on how to join
            the whitelist.
          </div>
        )}
      </>
    );
  }

  private closeMintFeedback(): void {
    this.setState({
      mintFeedback: null,
    });
  }

  private generateOpenSeaUrl(): string {
    const subdomain = this.state.network?.chainId === 1 ? "www" : "testnets";

    return (
      `https://${subdomain}.opensea.io/` +
      (CollectionConfig.openSeaSlug
        ? "collection/" + CollectionConfig.openSeaSlug
        : null)
    );
  }

  private generateNFTUrl(): string {
    const subdomain = this.state.network?.chainId === 1 ? "www" : "testnets";

    return (
      `https://${subdomain}.opensea.io/` +
      (CollectionConfig.contractAddress
        ? "assets/" + CollectionConfig.contractAddress
        : null) +
      "/"
    );
  }

  private refreshPage(): void {
    return window.location.reload();
  }
}

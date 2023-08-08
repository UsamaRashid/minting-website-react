

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Alphabets is ERC721Enumerable, Ownable {
    using Strings for uint256;

    string baseURI;
    string public baseExtension = ".json";

    uint256 public maxSupply = 26; //total Mintables Supply

    bool public mintState = false;
    uint256 public cost = 0.02 ether;

    constructor(
        string memory _initBaseURI
    ) ERC721("Alphabets","ALPHABETS") {
        baseURI = _initBaseURI;
    }

    // internal functions
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    // external functions
    function mint(uint256 tokenId) external payable {
        uint256 supply = totalSupply();
        require(mintState, "Minting is paused");
        require(
            tokenId <= maxSupply,
            "TokenID cannot be greater than maxSupply"
        );
        require(tokenId > 0, "TokenID cannot be 0");

        require(!_exists(tokenId), "TokenId already minted!");

        require(supply < maxSupply, "Cannot mint more than max Supply");

        require(msg.value == cost, "Cost Error");
        _mint(msg.sender, tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        baseExtension
                    )
                )
                : "";
    }

    function nftsOnwedByWallet(address _owner)
        external
        view
        returns (uint256[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    //only owner
    function setCost(uint256 _newCost) external onlyOwner {
        cost = _newCost;
    }

    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
    }

    function setBaseExtension(string memory _newBaseExtension)
        external
        onlyOwner
    {
        baseExtension = _newBaseExtension;
    }

    function setMintState(bool _state) external onlyOwner {
        mintState = _state;
    }

    function withdraw() external payable onlyOwner {
        require(address(this).balance > 0, "Balance of this Contract is Zero");
        (bool transfer, ) = payable(owner()).call{value: address(this).balance}(
            ""
        );
        require(transfer, "Withdraw unsuccessfull");
    }
}

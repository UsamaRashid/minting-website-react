// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract Alphabets is ERC721Enumerable, Ownable {
    using Strings for uint256;

    string imageURI;
    string public baseExtension = ".png";

    uint256 public maxSupply = 26; //total Mintables Supply

    bool public mintState = false;
    uint256 public cost = 0.02 ether;

    // Token Id to name minted
    mapping(uint256 => string) names;

    constructor(string memory imageUri) ERC721("Alphabets", "ALPHABETS") {
        imageURI = imageUri;
    }

    // internal functions
    function _imageURI()
        internal
        view
        returns (string memory)
    {
        return imageURI;
    }

    // external functions
    function mint(uint256 tokenId, string memory _name) external payable {
        uint256 supply = totalSupply();
        require(mintState, "Minting is paused");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(
            tokenId <= maxSupply,
            "TokenID cannot be greater than maxSupply"
        );
        require(tokenId > 0, "TokenID cannot be 0");

        require(!_exists(tokenId), "TokenId already minted!");

        require(supply < maxSupply, "Cannot mint more than max Supply");
       
        // Check if the first character of the entered name matches the expected character
        // Convert tokenId + 64 to a bytes1 value
        bytes1 expectedFirstChar = bytes1(uint8(tokenId + 64));

        // Check if the first character of the entered name matches the expected character
        require(
            bytes(_name)[0] == expectedFirstChar,
            "Name should start with the expected character"
        );

        require(msg.value == cost, "Cost Error");
        _mint(msg.sender, tokenId);
        names[tokenId] = _name;
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

        string memory _name = names[tokenId];
        string memory _description = "This is a NFT collection of Alphabets Collectibles";
        string memory uri = formatTokenURI(tokenId, _name, _description);
        return uri;
    }

    function formatTokenURI(
        uint256 tokenId,
        string memory _name,
        string memory _description
    ) private view returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                "{",
                                '"name":"',
                               _name,
                                '", "description":"',
                                _description,
                                '", "image":"',
                                string.concat(
                                    imageURI,
                                    Strings.toString(tokenId),
                                    baseExtension
                                ),
                                '"',
                                "}"
                            )
                        )
                    )
                )
            );
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

    function setImageURI(string memory _newImageURI) external onlyOwner {
        imageURI = _newImageURI;
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


// ipfs://bafybeifjft3uqjkzk2tlqm6pupwoiks5n2mswhjlyy6fom7vk76sko6eti/

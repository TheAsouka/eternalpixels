// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Ethernal is ERC721 {
    address public owner;
    uint256 public totalPixels; //Pixel counter, start at 0 by default
    uint256 public pixelCreationCost = 0.1 ether;


    struct Pixel {
        uint256 x;
        uint256 y;
        string color;
    }

    // id => struct
    //mapping(uint256 => Pixel) public pixels;
    Pixel[] public pixels;

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol){
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender == owner);
        // _; -> Function body -> modifier is checked before function is executed
        _;
    }

    function createPixel(uint256 _x, uint256 _y, string memory _color) public {
        // Effectuer les vérifications nécessaires, par exemple l'authentification de l'utilisateur
        
        // Créer un nouveau pixel avec les coordonnées et la couleur fournies
        Pixel memory newPixel = Pixel(_x, _y, _color);
        
        // Ajouter le pixel à la liste des pixels
        pixels.push(newPixel);
        
        // Émettre un événement pour signaler la création du pixel
        emit PixelCreated(_x, _y, _color);
    }

    event PixelCreated(uint256 indexed x, uint256 indexed y, string color);

    function getAllPixels() public view returns (Pixel[] memory) {
        return pixels;
    }

    function createPixels(Pixel[] memory _pixels) public payable {
        for (uint256 i = 0; i < _pixels.length; i++) {
            // Créer le pixel dans la blockchain
            createPixel(_pixels[i].x, _pixels[i].y, _pixels[i].color);
        }
    }



    //Permit the owner of the contract to withdraw ether stacked in the contract
    function withdraw() public onlyOwner {
        //{metadata}("data sent through the call")
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}
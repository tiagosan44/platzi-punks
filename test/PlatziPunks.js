const { expect } = require("chai");

describe('Platzi punks contract', () => {
    const setup = async ({ maxSupply = 10000 }) => {
        const [ owner ] = await ethers.getSigners();
        const PlatziPunks = await ethers.getContractFactory("PlatziPunks");
        const deployed = await PlatziPunks.deploy(maxSupply);
        return {
            owner, 
            deployed,
        };
    };

    describe('Deployment', () => {
        it('Set max supply to passed param', async () => {
            const maxSupply = 4000;
            const { deployed } = await setup({ maxSupply });
            const returnedMaxSupply = await deployed.maxSupply();
            expect(maxSupply).to.equal(returnedMaxSupply);
        });
    });

    describe("Minting", () => {
        it('Mints a new token and assings it to owner', async () => {
            const { owner, deployed } = await setup({  });
            await deployed.mint();
            const ownerOfMinted = await deployed.ownerOf(0);
            expect(ownerOfMinted).to.equal(owner.address);
        });

        it('Has a minting limit', async () => {
            const maxSupply = 2;
            const { deployed } = await setup({ maxSupply });

            // Mint all
            await Promise.all([deployed.mint(), deployed.mint()]);
            
            // Assert the las minting
            await expect(deployed.mint()).to.be.revertedWith("No PlatziPunks left"); 
        });
    });

    describe("tokenURI", () => {
        it('Returns valid metadata', async () => {
            const { deployed } = await setup({  });
            await deployed.mint();
            const tokenURI = await deployed.tokenURI(0); 
            const stringfiedTokeURI = await  tokenURI.toString();
            const [, base64Json ] = stringfiedTokeURI.split("data:application/json;base64,");
            const stringfiedMetadata = await Buffer.from(
                base64Json, "base64").toString("ascii");
            const metadata = JSON.parse(stringfiedMetadata);
            expect(metadata).to.have.all.keys("name", "description", "image");
        });
    });
});
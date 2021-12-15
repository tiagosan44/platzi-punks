const deploy = async () => {
    const [ deployer ] = await ethers.getSigners();
    console.log("Deploying contract with the account: ", deployer.address);
    const PlatziPunks = await ethers.getContractFactory("PlatziPunks");
    const deployed = await PlatziPunks.deploy();
    console.log("Platzi punks is deployed at: ", deployed.address);
}

deploy()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(console.error());
        process.exit(1);
    });
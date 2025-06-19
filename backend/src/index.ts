import { AppDataSource } from "./data-source"

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has beezfzn initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })
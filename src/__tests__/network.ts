import { doneTests, initTests } from "./init";
import { runCommand, consoleTerminal } from "..";
import { NetworkRegistry } from "../controllers/network/registry";
import { SignerRegistry } from "../controllers/signer/registry";

beforeAll(async () => {
    await initTests();
    await (new SignerRegistry()).addSecretKey(
        "alice",
        "",
        "172af540e43a524763dd53b26a066d472a97c4de37d5498170564510608250c3",
        true,
    )
});
afterAll(doneTests);

test("Add network giver by address", async () => {
    await runCommand(consoleTerminal, 'network giver 0:b5e9240fc2d2f1ff8cbb1d1dee7fb7cae155e5f6320e585fcc685698994a19a5', {
        name: 'se',
        signer: 'alice',
    })
    expect(new NetworkRegistry().get("se").giver?.name).toEqual("Giver");
});

test("Add network giver by type", async () => {
    await runCommand(consoleTerminal, 'network giver', {
        name: 'se',
        type: 'Giver',
        signer: 'alice',
    })
    expect(new NetworkRegistry().get("se").giver?.name).toEqual("Giver");

    await runCommand(consoleTerminal, 'network giver', {
        name: 'se',
        type: 'Multisig',
        signer: 'alice',
    })
    expect(new NetworkRegistry().get("se").giver?.name).toEqual("Multisig");
});

test("Add network giver error", async () => {
    try {
        await runCommand(consoleTerminal, 'network giver', {
            name: 'se',
            type: 'GiverV1',
            signer: 'alice',
        })
        expect(true).toBe(false);
    } catch (error: any) {
        expect(error.message).toBe("Unknown contract type GiverV1.");
    }
});

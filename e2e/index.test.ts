import { expect, it, describe, inject, vi } from 'vitest'
import { getByText } from '@testing-library/dom'
import { TurnkeyApi, init } from "@turnkey/http"

import {
    IframeStamper,
    TransactionType,
    MessageType,
} from "@turnkey/iframe-stamper";

const EXPORT_AND_SIGN_IFRAME_URL = inject("EXPORT_AND_SIGN_IFRAME_URL");

describe("e2e", () => {
    it("should load iframe", async () => {
        const container = document.createElement("div")
        window.document.body.appendChild(container)

        init({
            apiPublicKey: inject("API_PUBLIC_KEY")!,
            apiPrivateKey: inject("API_PRIVATE_KEY")!,
            baseUrl: inject("BASE_URL")!,
        })

        const result = await TurnkeyApi.createWallet({
            body: {
                type: "ACTIVITY_TYPE_CREATE_WALLET",
                organizationId: inject("ORGANIZATION_ID")!,
                timestampMs: String(Date.now()),
                parameters: {
                    walletName: "e2e-test-wallet",
                    accounts: [{
                        curve: "CURVE_SECP256K1",
                        addressFormat: "ADDRESS_FORMAT_ETHEREUM",
                        pathFormat: "PATH_FORMAT_BIP32",
                        path: "m/44'/60'/0'/0/0",
                        name: "e2e-test-account",
                    }]
                }
            }
        })

        const stamper = new IframeStamper({
            iframeUrl: EXPORT_AND_SIGN_IFRAME_URL,
            iframeContainer: container,
            iframeElementId: "export-and-sign-iframe",
        });

        await stamper.init()

        // const turnkey = new TurnkeyApi({
        //     defaultOrganizationId: inject("ORGANIZATION_ID")!,
        //     apiPublicKey: inject("API_PUBLIC_KEY")!,
        //     apiPrivateKey: inject("API_PRIVATE_KEY")!,
        //     apiBaseUrl: inject("BASE_URL")!,
        // })

        const message = "0x11"
        const signedMessage = await stamper.signMessage(
            {
                message,
                type: MessageType.Ethereum,
            },
            "0x0",
        )

        stamper.clear();
    }, 30000)
})
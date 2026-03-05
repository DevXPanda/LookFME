declare module "react-barcode" {
    import React from "react";

    interface BarcodeProps {
        value: string;
        width?: number;
        height?: number;
        format?: string;
        displayValue?: boolean;
        fontSize?: number;
        font?: string;
        textAlign?: string;
        textPosition?: string;
        textMargin?: number;
        background?: string;
        lineColor?: string;
        margin?: number;
        marginTop?: number;
        marginBottom?: number;
        marginLeft?: number;
        marginRight?: number;
        flat?: boolean;
        renderer?: string;
    }

    const Barcode: React.FC<BarcodeProps>;
    export default Barcode;
}

import * as React from "react";
import {CSSProperties} from "react";
import {TableCellProps} from "@mui/material/TableCell/TableCell";

export interface TableColumn {
    id: string;
    label: string;
    style: CSSProperties | undefined;
    align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
    format?: (value: any, row: any) => React.ReactNode;
    fcFormat?: (value: any, row: any) => React.FC;
    cellProps?: TableCellProps
}
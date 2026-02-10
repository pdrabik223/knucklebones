import { v4 as uuidv4 } from 'uuid';

export interface ColumnRef {
    children: React.ReactNode,
    expanded?: boolean
    style?: React.CSSProperties
    id?: string
}


export const Column: React.FC<ColumnRef> = (props: ColumnRef) => {

    let expanded = props.expanded != undefined ? props.expanded : false

    return <div
        key={uuidv4()}
        id={props.id}
        style={
            (() => {
                const baseStyle: React.CSSProperties = {
                    display: "flex",
                    flex: "auto",
                    flexDirection: "column",
                    flexWrap: "nowrap",
                    justifyContent: "center",
                    height: expanded ? "100%" : undefined
                };

                return { ...baseStyle, ...(props.style || {}) } as React.CSSProperties;
            })()

        }>
        {props.children}
    </div >

}
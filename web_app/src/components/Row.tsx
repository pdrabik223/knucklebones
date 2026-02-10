import { v4 as uuidv4 } from 'uuid';

export interface RowRef {
    children: React.ReactNode,
    expanded?: boolean,
    
    style?: React.CSSProperties
    id?: string
    className?: string
}


export const Row: React.FC<RowRef> = (props: RowRef) => {

    let expanded = props.expanded != undefined ? props.expanded : false
    
    return <div
        className={props.className}
        id={props.id}
        key={uuidv4()}
        style={
            (() => {
                const baseStyle: React.CSSProperties = {
                    display: "flex",
                    flex: "auto",
                    flexDirection: "row",
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
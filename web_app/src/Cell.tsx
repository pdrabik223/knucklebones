
export interface CellRef {
    value: number
}


export const Cell: React.FC<CellRef> = (props: CellRef) => {

    return (
        <h2>
            {props.value}
        </h2>
    );
};

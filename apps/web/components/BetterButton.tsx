'use client'

export default function BetterButton({
    onClick,
    style,
    children,
    bg,
    p = 5, pt=5, pb=5, pl=10, pr=10,
    m, mt, mb, ml, mr,
    radius,
    c
}: {
    onClick?: () => any,
    key: any,
    style?: Record<string, any>,
    children?: React.ReactNode,
    bg?: string,
    p?: number | string,
    pt?: number | string,
    pb?: number | string,
    pl?: number | string,
    pr?: number | string,
    m?: number | string,
    mt?: number | string,
    mb?: number | string,
    ml?: number | string,
    mr?: number | string,
    radius?: number | string,
    c?: string,
}) {
    return (
        <div 
            onClick={onClick}
            style={{
                display: 'flex',
                justifyContent: 'center',
                cursor: 'pointer',
                backgroundColor: bg ?? '#f2f2f2',
                padding: (pt || pb || pl || pr) ? undefined : p,
                paddingTop: pt ?? p,
                paddingBottom: pb ?? p,
                paddingLeft: pl ?? p,
                paddingRight: pr ?? p,
                margin: (mt || mb || ml || mr) ? undefined : m,
                marginTop: mt ?? m,
                marginBottom: mb ?? m,
                marginLeft: ml ?? m,
                marginRight: mr ?? m,
                borderRadius: radius,
                color: c,
                userSelect: 'none',
                fontWeight:'500',
                ...style
            }}
        >
            {children ? children : 'Kontol'}
        </div>
    )
}
export default function Button({title ,icon}) {
    return (
        <>
            <li className="nav-item">
                <button className="nav-link" >
                    <i className={icon} style={{fontStyle:"normal"}}>{title}</i>
                </button>
            </li>
        </>
    )
}
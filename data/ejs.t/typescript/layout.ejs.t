/**
 * @author lokio
 * @generated at <%= created_at %>
 */

import { type FC, Fragment, type PropsWithChildren } from "react";

const <%= Name %>Layout: FC<PropsWithChildren> = ({children}) => {
    return (
		<Fragment>
			<main>{children}</main>
		</Fragment>
	);
};

export default <%= Name %>Layout;

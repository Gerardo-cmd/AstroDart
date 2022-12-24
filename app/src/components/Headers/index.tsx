import React, { useContext } from "react";
import Callout from "plaid-threads/Callout";
import { Button } from "@mui/material";

import Link from "../Link";
import Context from "../../context";

import styles from "./index.module.scss";

const Header: React.FC = () => {
  const {
    linkToken,
    linkSuccess,
    isItemAccess,
    backend,
    linkTokenError,
  } = useContext(Context);

  return (
    <div className={styles.grid}>
      {!linkSuccess && 
        <>
          {/* message if backend is not running and there is no link token */}
          {!backend ? (
            <Callout warning>
              Something went wrong in the server, so you will not be able to link any accounts in the meanwhile. Please try again later.
            </Callout>
          ) : /* message if backend is running and there is no link token */
          linkToken == null && backend ? (
            <Callout warning>
              <div>
                Something went wrong in the server, so you will not be able to link any accounts in the meanwhile. Please try again later.
              </div>
              <div>
                Error Code: <code>{linkTokenError.error_code}</code>
              </div>
              <div>
                Error Type: <code>{linkTokenError.error_type}</code>{" "}
              </div>
              <div>Error Message: {linkTokenError.error_message}</div>
            </Callout>
          ) : linkToken === "" ? (
            <div className={styles.linkButton}>
              <Button color="info" disabled>
                Loading...
              </Button>
            </div>
          ) : (
            <div>
              <Link />
            </div>
          )}
        </>
      }
      {linkSuccess && 
        <div>
          <Link />
        </div>
      }
      <>
        {!isItemAccess &&
          <h4 className={styles.subtitle}>
            <Callout warning>
              Something went wrong in the server and we were unable to link account. Please try again later.
            </Callout>
          </h4>
        }
      </>
    </div>
  );
};

Header.displayName = "Header";

export default Header;

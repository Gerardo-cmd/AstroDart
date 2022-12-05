import React, { useContext } from "react";
import Callout from "plaid-threads/Callout";
import { Button } from "@mui/material";
import InlineLink from "plaid-threads/InlineLink";

import Link from "../Link";
import Context from "../../context";

import styles from "./index.module.scss";

const Header = () => {
  const {
    itemId,
    accessToken,
    linkToken,
    linkSuccess,
    isItemAccess,
    backend,
    linkTokenError,
    isPaymentInitiation,
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
              <Button disabled>
                Loading...
              </Button>
            </div>
          ) : (
            <div className={styles.linkButton}>
              <Link />
            </div>
          )}
        </>
      }
      <>
        {isPaymentInitiation ? (
          <>
          <h4 className={styles.subtitle}>
            Congrats! Your payment is now confirmed.
            <p/>
            <Callout>
              You can see information of all your payments in the{' '}
              <InlineLink
                  href="https://dashboard.plaid.com/activity/payments"
                  target="_blank"
              >
                Payments Dashboard
              </InlineLink>
              .
            </Callout>
          </h4>
          <p className={styles.requests}>
            Now that the 'payment_id' stored in your server, you can use it to access the payment information:
          </p>
        </>
        ) : /* If not using the payment_initiation product, show the item_id and access_token information */ (
          <>
          {!isItemAccess &&
            <h4 className={styles.subtitle}>
              <Callout warning>
                Something went wrong in the server and we were unable to link account. Please try again later.
              </Callout>
            </h4>
          }
        </>
        )}
      </>
    </div>
  );
};

Header.displayName = "Header";

export default Header;

/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import React, { useState, useContext } from 'react';
import Context from "../../context";
import { 
  Button, 
  Dialog,
  DialogTitle
} from '@mui/material';

import AccountItem from "../AccountItem";
import updateItems from "../../utils/Endpoints/UpdateItems";
import getTransactions from "../../utils/Endpoints/GetTransactions";
import { 
  getAccountsArray, 
  getCashAccountsArray, 
  getCreditAccountsArray, 
  getLoanAccountsArray, 
  getInvestmentAccountsArray, 
  unlinkAccount 
} from "../../utils/DataHandlers";

type SimpleDialogProps = Props & {
  open: boolean;
  onClose: () => void;
};

type Props = {
  itemId: string;
  accountId: string;
  accountName: string;
  accountBalance: string;
  accountType: string;
}

const styles = {
  input: css({
    margin: '50px 0px',
  }),
  error: css({
    color: 'red',
  }),
  unlinkButton: css({
    textTransform: 'none',
  }),
  popupModal: css({
    justifyContent: 'center',
    verticalAlignment: 'center',
    textAlignment: 'center'
  })
};

const SimpleDialog: React.FC<SimpleDialogProps> = ({ itemId, accountId, accountName, accountBalance, accountType, onClose, open }) => {
  const { email, items, dispatch } = useContext(Context);

  const handleClose = () => {
    onClose();
  };

  const handleDeletion = async () => {
    // Get the new items with the account unlinked
    let newItems = await unlinkAccount(items, itemId, accountId);
    if (!newItems) {
      newItems = {};
    }
    // Update the database with the new items
    await updateItems(email, newItems);
    const transactionsData: any[] = await getTransactions(email.trim().toLowerCase()) ;
    // Dispatch the new items and the new accountsArray
    dispatch({
      type: "SET_STATE",
      state: {
        // @ts-ignore
        items: newItems, 
        accountsArray: getAccountsArray(newItems), 
        cashAccountsArray: getCashAccountsArray(newItems), 
        creditAccountsArray: getCreditAccountsArray(newItems), 
        loanAccountsArray: getLoanAccountsArray(newItems), 
        investmentAccountsArray: getInvestmentAccountsArray(newItems),
        transactions: transactionsData 
      },
    });
    onClose();
    return;
  }

  return (
    <Dialog css={styles.popupModal} disableScrollLock={true} onClose={handleClose} open={open}>
      <DialogTitle>You are about to unlink {accountName}. Are you sure? This cannot be undone.</DialogTitle>
      <Button color="error" onClick={handleDeletion}>Yes, I am sure</Button>
    </Dialog>
  );
}

const DeleteItemModal: React.FC<Props> = ({ itemId, accountId, accountName, accountBalance, accountType }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button css={styles.unlinkButton} onClick={handleClickOpen}>
        <AccountItem name={accountName} balance={accountBalance} type={accountType} />
      </Button>
      <SimpleDialog
        itemId={itemId} 
        accountId={accountId} 
        accountName={accountName} 
        accountBalance={accountBalance} 
        accountType={accountType}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
};

export default DeleteItemModal;
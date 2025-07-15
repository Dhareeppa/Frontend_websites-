import React from 'react';
import { useState, useContext, useEffect } from "react";
import { FcCurrencyExchange } from "react-icons/fc";
import { HiOutlineLogout } from "react-icons/hi";
import { MdAccountBalance, MdWorkHistory } from "react-icons/md";
import { FaCreditCard, FaHandHoldingUsd, FaMoneyCheckAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/Authcontext";
import "./Mainhome.css";

function MainHome() {
  const [userData, setUserData] = useState(null);
  const [Transaction_History, setTransaction_History] = useState(null);
  const [History, setHistory] = useState(null);
  const [Receivemoney, setReceivemoney] = useState(null);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("account");
  const [recipient, setRecipient] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();
  const { logoutUser, authToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!authToken?.access) {
        setError("Authentication token not available. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(import.meta.env.VITE_USER_LOGGED_API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken.access}`
          },
        });

        const responseText = await response.text();

        if (response.status === 401) {
          setError("Your session has expired. Please log in again.");
          logoutUser();
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }

        const data = JSON.parse(responseText);
        setUserData(data);
        setLoading(false);

      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authToken, logoutUser]);

  useEffect(() => {
    if (activeSection === "receive") {
      fetchReceiveTransactionHistory();
    }
  }, [activeSection]);
  
  useEffect(() => {
    if (activeSection === "history") {
      TransactionHistory();
    }
  }, [activeSection]);

  const fetchReceiveTransactionHistory = async () => {
    if (!authToken?.access) {
      return;
    }

    setTransactionLoading(true);
    try {
      const response = await fetch(import.meta.env.VITE_RECEIVE_TRANSACTION_API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken.access}`
        },
      });

      if (!response) {
        throw new Error("Network error: Unable to reach server");
      }

      if (response.status === 401) {
        setError("Your session has expired. Please log in again.");
        logoutUser();
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch transaction history: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setTransaction_History(data.transactions || data || []);

    } catch (err) {
      console.error("Error fetching transaction history:", err);

      if (err.message.includes("401") || err.message.includes("session")) {
        setError("Your session has expired. Please log in again.");
        logoutUser();
      } else {
        setError("Failed to load transaction history. Please try again.");
      }
    } finally {
      setTransactionLoading(false);
    }
  };

  const TransactionHistory = async () => {
    if (!authToken?.access) {
      return;
    }

    setTransactionLoading(true);
    try {
      const response = await fetch(import.meta.env.VITE_GET_TRANSACTION_API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken.access}`
        },
      });

      if (response.status === 401) {
        setError("Your session has expired. Please log in again.");
        logoutUser();
        return;
      }

      if (response.status === 404) {
        setHistory([]);
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch transaction history: ${response.status}`);
      }

      const data = await response.json();

      if (data && Array.isArray(data) && data.length > 0) {
        setHistory(data);  
      } else {
        setHistory([]);
      }

    } catch (err) {
      console.error("Error fetching transaction history:", err);
      setError("Failed to load transaction history. Please try again.");
      setHistory([]);
    } finally {
      setTransactionLoading(false);
    }
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  const handleSendMoney = async () => {
    if (!accountNumber || !amount || !recipient) {
      alert("Please enter account number, recipient name, and amount.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(import.meta.env.VITE_TRANSACTION_SEND_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken.access}`
        },
        body: JSON.stringify({
          receiver_account_number: accountNumber,
          recipient_name: recipient,
          amount: parseFloat(amount),
          description: description || "Money transfer"
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(`Successfully sent $${amount}! Transaction ID: ${data.transaction_id}`);
        setUserData();
        setAccountNumber("");
        setRecipient("");
        setAmount("");
        setDescription("");
      } else {
        alert(data.error || "Failed to send money");
      }
    } catch (err) {
      console.error("Transfer error:", err);
      alert("Failed to send money. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };


  const formatAmount = (amount) => {
    try {
      return parseFloat(amount).toFixed(2);
    } catch {
      return amount;
    }
  };


  const getStatusClass = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'completed') return 'status-completed';
    if (statusLower === 'pending') return 'status-pending';
    return 'status-failed';
  };

  return (
    <div className="home-container">
      <div className="home-heading">
        <p className="head-line">
          <FcCurrencyExchange /> Money Pay
        </p>
        <button className="logout-btn" onClick={logoutUser}>
          <HiOutlineLogout />
        </button>
      </div>

      <div className="dashboard">
        <div className="sidebar">
          <button className={activeSection === "account" ? "active" : ""} onClick={() => handleSectionClick("account")}>
            <MdAccountBalance className="icon" /> Accounts
          </button>
          <button className={activeSection === "send" ? "active" : ""} onClick={() => handleSectionClick("send")}>
            <FaCreditCard className="icon" /> Send Money
          </button>
          <button className={activeSection === "receive" ? "active" : ""} onClick={() => handleSectionClick("receive")}>
            <FaHandHoldingUsd className="icon" /> Receive Money
          </button>
          <button className={activeSection === "balance" ? "active" : ""} onClick={() => handleSectionClick("balance")}>
            <FaMoneyCheckAlt className="icon" /> Check Bank Balance
          </button>
          <button className={activeSection === "history" ? "active" : ""} onClick={() => handleSectionClick("history")}>
            <MdWorkHistory className="icon" /> Transaction History
          </button>
        </div>

        <div className="content">
          {loading && <div className="loading-indicator">Loading...</div>}

          {!loading && error && (
            <div className="error-message">
              <h3>Error</h3>
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Try Again</button>
            </div>
          )}

          {!loading && !error && activeSection === "account" && (
            <div className="section">
              <h3>Account Details</h3>
              {userData ? (
                <div className="info">
                  <p><strong>Name:</strong> {userData.first_name} {userData.middle_name} {userData.last_name}</p>
                  <p><strong>Account Number:</strong> {userData.account_number}</p>
                  <p><strong>Balance:</strong> ${userData.available_balance}</p>
                  <p><strong>Phone:</strong> {userData.phone_number}</p>
                  <p><strong>Address:</strong> {userData.current_address}</p>
                </div>
              ) : (
                <p>No user data available.</p>
              )}
            </div>
          )}

          {!loading && !error && activeSection === "send" && (
            <div className="section">
              <h3>Send Money</h3>
              <div className="input-send">
                <div className="form-item full-width">
                  <label>Recipient</label>
                  <input type="text" placeholder="Recipient Name" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
                </div>
                <div className="form-item full-width">
                  <label>Account Number</label>
                  <input type="number" placeholder="Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
                </div>
                <div className="form-item full-width">
                  <label>Enter Money</label>
                  <input type="number" placeholder="Amount ($)" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                <div className="form-item full-width">
                  <label>Description</label>
                  <input type="text" placeholder="operational" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
              </div>
              <button className="send-btn" onClick={handleSendMoney} disabled={loading || !amount}>Send</button>
            </div>
          )}

          {!loading && !error && activeSection === "receive" && (
            <div className="section">
              <div className="transaction-header">
                <h3>💰 Receive Money</h3>
                {transactionLoading ? (
                  <div className="loading">Loading account info...</div>
                ) : Transaction_History?.length > 0 ? (
                  <div className="stats">
                    <p><strong class="total_record">Total Received Records:</strong> {Transaction_History.length}</p>
                  </div>
                ) : null}
              </div>

              {transactionLoading ? (
                <div className="loading">Loading transactions...</div>
              ) : Transaction_History?.length > 0 ? (
                <div className="transaction-container">
                  {Transaction_History.map((txn, index) => (
                    <div key={`receive-${txn.id || index}`} className="transaction-card">
                      <div className="transaction-field">
                        <strong>Name:</strong> 
                        <span className="name-value">{txn.recipient_name}</span>
                      </div>
                      <div className="transaction-field">
                        <strong>Account:</strong> 
                        <span className="account-value">{txn.recipient_account}</span>
                      </div>
                      <div className="transaction-field">
                        <strong>Status:</strong> 
                        <span className={`status-badge ${getStatusClass(txn.status)}`}>
                          {txn.status}
                        </span>
                      </div>
                      <div className="transaction-field">
                        <strong>Date:</strong> 
                        <span className="date-value">{formatDate(txn.transaction_date)}</span>
                      </div>
                      <div className="transaction-field">
                        <strong>Amount:</strong> 
                        <span className="amount-value">${formatAmount(txn.amount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">
                  <p>No transaction records available.</p>
                </div>
              )}
            </div>
          )}
          
          {!loading && !error && activeSection === "balance" && (
            <div className="section">
              <h3>$ Current Balance</h3>
              <h2>${userData?.available_balance || "0.00"}</h2>
            </div>
          )}

          {!loading && !error && activeSection === "history" && (
            <div className="section">
              <div className="transaction-header">
                <h3>📊 Transaction History</h3>
                {transactionLoading ? (
                  <div className="loading">Loading transaction history...</div>
                ) : error ? (
                  <div className="error-message">
                    <p>{error}</p>
                    <button onClick={() => TransactionHistory()}>Retry</button>
                  </div>
                ) : History?.length > 0 ? (
                  <div className="stats">
                    <p><strong class="total_record">Total Records:</strong> {History.length}</p>
                  </div>
                ) : null}
              </div>

              {transactionLoading ? (
                <div className="loading">Loading transactions...</div>
              ) : error ? (
                <div className="error-message">
                  <p>{error}</p>
                  <button onClick={() => TransactionHistory()}>Retry</button>
                </div>
              ) : History?.length > 0 ? (
                <div className="transaction-container">
                  {History.map((txn, index) => (
                    <div key={`history-${txn.id || index}`} className="transaction-card">
                      <div className="transaction-field">
                        <strong>Name:</strong> 
                        <span className="name-value">{txn.recipient_name}</span>
                      </div>
                      <div className="transaction-field">
                        <strong>Account:</strong> 
                        <span className="account-value">{txn.recipient_account}</span>
                      </div>
                      <div className="transaction-field">
                        <strong>Status:</strong> 
                        <span className={`status-badge ${getStatusClass(txn.status)}`}>
                          {txn.status}
                        </span>
                      </div>
                      <div className="transaction-field">
                        <strong>Date:</strong> 
                        <span className="date-value">{formatDate(txn.transaction_date)}</span>
                      </div>
                      <div className="transaction-field">
                        <strong>Amount:</strong> 
                        <span className="amount-value">${formatAmount(txn.amount)}</span>
                      </div>
                      <div className="transaction-field">
                        <strong>Type:</strong> 
                        <span className="type-value">{txn.transaction_type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">
                  <p>No transaction records available.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainHome;
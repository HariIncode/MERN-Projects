import { useState } from "react";
import OTPInput from "react-otp-input";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MIN_BALANCE = {
  Savings: 1000,
  Premium: 5000,
  Business: 10000,
};

export default function CreateAccount() {
  const [name, setName] = useState("");
  const [accountType, setAccountType] = useState("Savings");
  const [pin, setPin] = useState("");
  const [balance, setBalance] = useState(MIN_BALANCE.Savings);
  const navigate = useNavigate();

  const api = "http://localhost:5000/api/auth/signup";

  const validateName = () => /^[a-zA-Z ]+$/.test(name);

  const validateForm = () => {
    if (!validateName()) {
      alert("Only alphabets and spaces allowed for Name");
      return false;
    }
    if (pin.length !== 4) {
      alert("PIN must be 4 digits");
      return false;
    }
    if (balance < MIN_BALANCE[accountType]) {
      alert(
        `Minimum balance to create a ${accountType} account is ${MIN_BALANCE[accountType]}`
      );
      setBalance(MIN_BALANCE[accountType]);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const payload = { name, pin, accountType, balance };
      const response = await axios.post(api, payload, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Response:", response.data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Name */}
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          maxLength={25}
          minLength={3}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Account Type */}
      <div>
        <label>Account Type:</label>
        <select
          value={accountType}
          onChange={(e) => {
            const type = e.target.value;
            setAccountType(type);
            if (balance < MIN_BALANCE[type]) {
              setBalance(MIN_BALANCE[type]);
            }
          }}
        >
          <option value="Savings">Savings</option>
          <option value="Premium">Premium</option>
          <option value="Business">Business</option>
        </select>
      </div>

      {/* Balance */}
      <div>
        <label>Balance:</label>
        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          value={balance}
          maxLength={6}
          onChange={(e) => {
            if (/^\d*$/.test(e.target.value)) {
              setBalance(Number(e.target.value));
            }
          }}
        />
      </div>

      {/* PIN */}
      <OTPInput
        value={pin}
        onChange={setPin}
        numInputs={4}
        renderSeparator={<span>-</span>}
        renderInput={(props) => (
          <input
            {...props}
            type="tel"
            inputMode="numeric"
            onKeyDown={(e) => {
              if (e.key.length === 1 && !/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
            onPaste={(e) => {
              if (!/^\d+$/.test(e.clipboardData.getData("Text"))) {
                e.preventDefault();
              }
            }}
          />
        )}
        inputStyle={{
          width: "2rem",
          height: "2rem",
          fontSize: "1.5rem",
          textAlign: "center",
        }}
      />

      {/* Submit */}
      <button type="submit">Create Account</button>
    </form>
  );
}

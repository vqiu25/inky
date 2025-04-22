import "../App.css";
import logo from "../assets/logo.svg";
import googleLogo from "../assets/google-logo.svg";
import styles from "../assets/LoginPage.module.css";

function LoginPage() {
  return (
    <div className={styles.container}>
      <img src={logo} className={styles.logo}></img>
      <h1 className={styles.title}>Inky</h1>
      <button className={styles.googleButton}>
        <img src={googleLogo} className={styles.googleLogo}></img>Sign in with
        Google
      </button>
      <button className={styles.button}>Play as Guest</button>
    </div>
  );
}

export default LoginPage;

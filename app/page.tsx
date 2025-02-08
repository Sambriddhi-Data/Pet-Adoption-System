import Navbar from "@/components/navbar"
import RegisterButton from "@/components/registerButton";

export default function Home() {
  return (
    <div>
      <Navbar />
      <h1>Welcome to Fur-Ever Friends</h1>
      <div>Adopt a pet?</div>
      <h1>Lost a Pet?</h1>
      <p>New to the website? </p><RegisterButton/>
    </div>
  );
}

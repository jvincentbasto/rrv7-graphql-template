import Wrapper from "./Wrapper";

export default function Navbar() {
  return (
    <nav className="w-full h-[50px] bg-primary flex justify-center items-center max-sm:justify-start">
      <Wrapper>
        <a className="navbar-brand" href="/">
          <div className="flex">
            {/* <img src={"/logo.png"} alt='logo' className='size-[30px] mr-[10px] hue-rotate-[90deg]' /> */}
            <img
              src={"/logo.png"}
              alt="logo"
              className="size-[30px] mr-[10px]"
            />
            <p className="font-bold text-[20px] text-white">RRV7 GraphQL</p>
          </div>
        </a>
      </Wrapper>
    </nav>
  );
}

export default  function registration(){
    return(
<div className="container mx-auto px-4 py-5">
    <div className="shadow-lg border-0 my-5 overflow-hidden">
        <div className="p-0">
            <div className="flex  min-h-full flex-col justify-center px-6 py-6 lg:px-8 ">
                <div className="hidden lg:6 lg:w-11/12 bg-register-image"></div>
                <div className="lg:w-auto">
                    <div className="p-5">
                        <div className="text-center">
                            <h1 className="text-4xl text-gray-900 mb-4">Create an Account!</h1>
                        </div>
                        <form className="user">
                            <div className="flex flex-wrap mb-3">
                                <div className="w-full lg:w-1/2 mb-3 lg:mb-0">
                                    <input type="text" className="block w-full border rounded-md p-2" id="exampleFirstName" placeholder="First Name"/>
                                </div>
                                <div className="w-full lg:w-1/2">
                                    <input type="text" className="block w-full border rounded-md p-2" id="exampleLastName" placeholder="Last Name"/>
                                </div>
                            </div>
                            <div className="mb-3">
                                <input type="email" className="block w-full border rounded-md p-2" id="exampleInputEmail" placeholder="Email Address"/>
                            </div>
                            <div className="flex flex-wrap mb-3">
                                <div className="w-full lg:w-1/2 mb-3 lg:mb-0">
                                    <input type="password" className="block w-full border rounded-md p-2" id="exampleInputPassword" placeholder="Password"/>
                                </div>
                                <div className="w-full lg:w-1/2">
                                    <input type="password" className="block w-full border rounded-md p-2" id="exampleRepeatPassword" placeholder="Repeat Password"/>
                                </div>
                            </div>
                            <a href="login.html" className="bg-blue-500 text-white py-2 px-4 rounded w-full text-center">
                                Register Account
                            </a>
                            <hr className="my-4"/>
                            <a href="index.html" className="bg-red-500 text-white py-2 px-4 rounded w-full text-center flex items-center justify-center">
                                <i className="fab fa-google fa-fw"></i> Register with Google
                            </a>
                            <a href="index.html" className="bg-blue-600 text-white py-2 px-4 rounded w-full text-center flex items-center justify-center">
                                <i className="fab fa-facebook-f fa-fw"></i> Register with Facebook
                            </a>
                        </form>
                        <hr className="my-4"/>
                        <div className="text-center">
                            <a className="text-sm text-blue-500" href="forgot-password.html">Forgot Password?</a>
                        </div>
                        <div className="text-center">
                            <a className="text-sm text-blue-500" href="login.html">Already have an account? Login!</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</div>
    );
}
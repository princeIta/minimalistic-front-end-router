# minimalistic-front-end-router

This is a light weight front-end router with basic functionality of rendering
sections of a page according to path specified in the hash section of a url.

## Installation

In your Html file add a script tag of this module just before the closing body tag, like this:

**`<script src="js/minimalistic-front-end-router.js"></script>`**

## Usage

### initialize

**syntax**:  

    var router = Minf([options]);

**e.g**:  

    var options = {container: document.getElementById('containerDiv'), nullrouteRedirect: '/'}

    var router = Minf(options);

**options**  is an object with two properties, `container` and `nullrouteRedirect`

One of the ways to use this module is to specify a container ( view container ). A view container is a Html container within which
route views are rendered. container is of data type, string.

**nullrouteRedirect** is a route path of type string that gets redirected to in cases where a route which hasnt been registered is encountered.

### register route

#### syntax

`router.route(Path, routeHandler[, callback ...]);`

##### routeHandler

If a display container has been set then **rounteHandler** should be a function that returns a view, this view will be displayed within the view container
that has been specified already in the options parameter when Minf was called. An example:

    <html>
        <head></head>
        <body>
            <div id="view-container">
                <!--container within which views will be rendered-->
            </div>

            <script src="assets/js/minimalistic-front-end-router.js"></script>  
            <script>
                // get display container
                var options = {container: document.getElementById('view-container')}
                var router = Minf(options);

                // register routes
                // http://mysite.com#signin
                router.route('signin',
                    ()=>{
                        return `
                            <form method='post'>
                                <input type='text' name="username"/>
                                <input type='password' name='pwrd'/>
                                <input type='submit' value="sign in"/>
                            </form>
                        `;
                    }
                );

                // http://mysite.com#signup
                router.route('signup',
                    ()=>{
                        return `
                            <form method='post'>
                                <input type='text' name="username"/>
                                <input type='password' name='pwrd'/>
                                <input type='password' name='confirmpwrd'/>
                                <input type='submit' value="sign up"/>
                            </form>
                        `;
                    }
                );
            </script>
        </body>
    </html>

A route handler can also return an **id** to a view which has been declared within your HTML file. In this case you declare all views within the HTML file with
attribute `hidden` and in the **routeHandler** return the **id** to the view.
**note:** if you are going to return views as id to container in your html then you dont have to set the container option when you initialize Minf.
If container option isnt set during initialization of Minf, it assumes that views are passed in via view id. An example:

    <html>
        <head></head>
        <body>
            <div>
                <form method='post' id="signin-form" hidden>
                    <input type='text' name="username"/>
                    <input type='password' name='pwrd'/>
                    <input type='submit' value="sign in"/>
                </form>
                <form method='post' id="signup-form" hidden>
                    <input type='text' name="username"/>
                    <input type='password' name='pwrd'/>
                    <input type='password' name='confirmpwrd'/>
                    <input type='submit' value="sign up"/>
                </form>
            </div>

            <script src="assets/js/minimalistic-front-end-router.js"></script>  
            <script>
                // note: no view container set like before

                // initialize
                var router = Minf();

                // register routes
                // http://mysite.com#signin
                router.route('signin',
                    ()=>{
                        return "signin-form";
                    }
                );

                // http://mysite.com#signup
                router.route('signup',
                    ()=>{
                        return "signup-form";
                    }
                );
             </script>
        </body>
    </html>

##### callbacks

They're cases where an operation needs to be carried out after routing, such as to change a heading or scroll to a particular section of the page. You
pass in this extra operations as callbacks when routes are registered, Minf will call them after displaying the view. An example:

    <html>
        <head></head>
        <body>
            <h2 id="heading"></h2>
            <div>
                <form method='post' id="signin-form" hidden>
                    <input type='text' name="username"/>
                    <input type='password' name='pwrd'/>
                    <input type='submit' value="sign in"/>
                </form>
                <form method='post' id="signup-form" hidden>
                    <input type='text' name="username"/>
                    <input type='password' name='pwrd'/>
                    <input type='password' name='confirmpwrd'/>
                    <input type='submit' value="sign up"/>
                </form>
            </div>

            <script src="assets/js/minimalistic-front-end-router.js"></script>  
            <script>
                // note: no view container set like before

                // initialize
                var router = Minf();

                // register routes
                // http://mysite.com#signin
                router.route('signin',
                    ()=>{
                        return "signin-form";
                    },
                    ()=>{
                        var heading = document.getElementById('heading');
                        heading.textContent = 'SIGN IN';
                    }
                );

                // http://mysite.com#signup
                router.route('signup',
                    ()=>{
                        return "signup-form";
                    },
                    ()=>{
                        var heading = document.getElementById('heading');
                        heading.textContent = 'SIGN UP';
                    }
                );
            </script>
        </body>
    </html>

##### default view

default view is a view that displays when an undefined route  path is detected in the hash section of url in the address bar of the browser.
default views are defined using the string '*' as shown in the example below:

    <html>
        <head></head>
        <body>
            <h2 id="heading"></h2>
            <div>
                <form method='post' id="signin-form" hidden>
                    <input type='text' name="username"/>
                    <input type='password' name='pwrd'/>
                    <input type='submit' value="sign in"/>
                </form>
                <form method='post' id="signup-form" hidden>
                    <input type='text' name="username"/>
                    <input type='password' name='pwrd'/>
                    <input type='password' name='confirmpwrd'/>
                    <input type='submit' value="sign up"/>
                </form>
                <div id="default">
                    <h5> oops! this route is not defined </h5>
                </div>
            </div>

            <script src="assets/js/minimalistic-front-end-router.js"></script>  
            <script>
                // note: no view container set like before

                // initialize
                var router = Minf();

                // register routes

                // default route, displays when an undefined route path is detected
                // http://mysite.com#undefinedroute
                router.route('*',
                    ()=>{
                        return 'default'
                    });

                // http://mysite.com#signin
                router.route('signin',
                    ()=>{
                        return "signin-form";
                    },
                    ()=>{
                        var heading = document.getElementById('heading');
                        heading.textContent = 'SIGN IN';
                    }
                );

                // http://mysite.com#signup
                router.route('signup',
                    ()=>{
                        return "signup-form";
                    },
                    ()=>{
                        var heading = document.getElementById('heading');
                        heading.textContent = 'SIGN UP';
                    }
                );
            </script>
        </body>
    </html>

Two more ways to handle undefined route path is to set the `nullrouteRedirect` option when Minf is initialize. If you want Minf to redirect to the route defined as `signin` each time an undefined route is detected then set `var options = {nullrouteRedirect: 'signin'}`. **note:** defining a default route using '*' as route string as shown above, takes precedence over the route specified in nullrouteRedirect, this implies that if a default route is set, Minf rather dislays the view specifeid by the default route than redirect to the route specified in nullrouteRedirect.

The other way is to let Minf handle undefined route for you, in this case it shows an error message when an undefined route is detected.

##### more on redirects

Each registered callback passed in when route is defined is passed the Minf object as argument, this object exposes the internals of Minf. A particular property
of importance in this object is the `redirect` property. This property redirects from one route to another. An example:

    <html>
        <head></head>
        <body>
            <h2 id="heading"></h2>
            <div>
                <form method='post' id="signin-form" hidden>
                    <input type='text' name="username"/>
                    <input type='password' name='pwrd'/>
                    <input type='submit' value="sign in"/>
                </form>
                <form method='post' id="signup-form" hidden>
                    <input type='text' name="username"/>
                    <input type='password' name='pwrd'/>
                    <input type='password' name='confirmpwrd'/>
                    <input type='submit' value="sign up"/>
                </form>
            </div>

            <script src="assets/js/minimalistic-front-end-router.js"></script>  
            <script>
                // note: no view container set like before

                // initialize
                var router = Minf();

                // register routes

                // http://mysite.com
                router.route('/', null,
                    (minf)=>{
                        minf.redirect('signin');
                    }
                );

                // http://mysite.com#signin
                router.route('signin',
                    ()=>{
                        return "signin-form";
                    },
                    ()=>{
                        var heading = document.getElementById('heading');
                        heading.textContent = 'SIGN IN';
                    }
                );

                // http://mysite.com#signup
                router.route('signup',
                    ()=>{
                        return "signup-form";
                    },
                    ()=>{
                        var heading = document.getElementById('heading');
                        heading.textContent = 'SIGN UP';
                    }
                );
            </script>
        </body>
    </html>

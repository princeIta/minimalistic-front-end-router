'use strict'
const minfroutes = {};
const minfhandlers = {};
const minfviews = {};
var minfcontainer = undefined;
var minfOldRoute = '';

function minfredirect(redirectTo){
    window.location.hash = redirectTo;
}

// this object will be passed into all callbacks in minfroute.
// it exposes all operations that you would love to be
// carried out in route handlerss. for now it has only the the redirect function
// as a property. more properties can be added
const minfrouteFunc = {}

// define routes.
// you specify a route path (1st parameter) with its view (2nd parameter),
// the view (2nd parameter) may be a function that returns a view
// or a function that returns an id to a view container which is inside your html.
// In the 2nd case (where a function returns an id to a view container) ensure that you
// define a css class of type hidden. this class should have a property 'display: none'.
// finally, in your view add this css class to your class attribute
// you dont need to follow this procedure if you're going to return a view in the 2nd parameter
const minfroute = function(path, view, ...callbacks){
	if(callbacks){
		minfroutes[path] = {callbacks: callbacks};
	}
	
    if(typeof(view) === 'function'){
		minfrouteFunc.minfredirect = minfredirect;
		minfviews[path] = view(minfrouteFunc);	
	}
	else{
		minfviews[path] = view;
	}
};

function minfgetView(route){
	if(!(route in minfviews)){
		try{
			return minfgetView('*');
		}
		catch(err){
			if(!minfcontainer){
				var minfElem = document.getElementById(Object.values(minfviews)[0]);
				console.log(minfviews)
				const minfNullRoute = 'minfNullRoute';
				minfElem.insertAdjacentHTML("beforebegin",
											`<p id='${minfNullRoute}' class='hidden'>
												Oops! This route is not defined</p>`);
				minfviews['*'] = minfNullRoute;
				return minfviews['*']
			}

			minfviews['*'] = "<p>Oops! This route is not defined</p>";
			return minfviews['*'];
		}
    }else{
        return minfviews[route];
    }
};

function minfresolveRoute(route){
	// a route may be specified to trigger a function but not change the current view.
	// such route would have null or undefined registered as handler
	// in such a case the registered "dummy" handler (null or undefined) should not be altered.
	if(minfOldRoute && !((minfOldRoute in minfviews) && !minfviews[minfOldRoute])){ 
		if(minfcontainer && minfcontainer.innerHTML){
			minfviews[minfOldRoute] = minfcontainer.innerHTML;	
		}else{
			if(!((route in minfviews) && !minfviews[route])){
				var prevViewId = document.getElementById(minfgetView(minfOldRoute).startsWith('#')
													?minfgetView(minfOldRoute).slice(1)
													:minfgetView(minfOldRoute));
				prevViewId.classList.add('hidden');
			}
			
		}
	}
	
	// in case null or undefined is used for route handler.
	// in this case they're referred to as "dummy" handlers,
	// since they dont change views but merely carry out specific functions
	if(!((route in minfviews) && !minfviews[route])){
		if(minfcontainer && minfcontainer.innerHTML){
			if(minfgetView(route)){
				minfcontainer.innerHTML = minfgetView(route);	
			}
		}else{
			var currentViewId = document.getElementById(minfgetView(route).startsWith('#')
													?minfgetView(route).slice(1)
													:minfgetView(route));
			currentViewId.classList.remove('hidden');
		}
		minfOldRoute = route;
	}

	var callbacks = minfroutes[route] && minfroutes[route].callbacks? minfroutes[route].callbacks:''
	if(callbacks && callbacks.length){
		callbacks.forEach(callback=>callback(minfrouteFunc));
	}
};

const minfrouter = (evt) => {
    const url = window.location.hash.slice(1) || "/";
    minfresolveRoute(url);
};

// If the route handler you will pass to minfroute function -defined above- returns a view container,
// then the argument you pass to this function should be the id to the container you
// want the view to be displayed in
function minfsetContainer(containerDiv){
	minfcontainer = containerDiv;
}

// For first load or when routes are changed in browser address field.
window.addEventListener('load', minfrouter);
window.addEventListener('hashchange', minfrouter);
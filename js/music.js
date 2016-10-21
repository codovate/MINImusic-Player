//Create an immediately invoked functional expression 
(function(){

    // 2- Define Our Constructor -- Pointing Modal Variable at a function creates a "functional object" , which can be instatiated with "new" keyword. (e.g  var myModal = new Modal();)
    this.Modal = function() {

        //Create global element references 
        this.closeButton = null;
        this.modal = null;
        this.overlay = null;

        //Define option defaults
        var defaults = {
            className: 'fade-and-drop',
            closeButton: true,
            content: "",
            maxWidth: 600,
            minWidth: 280,
            overlay: true
        }

        // Create options by extending defaults with the passed in arguments
        if( arguments[0] && typeof arguments[0] == "object" ) {
            this.options = extendDefaults(defaults, arguments[0] ); 
        }

    }

    //5 - Public Methods -- attaching method to Modal object's prototype 
    Modal.prototype.open = function(){
        //open code goes here

        //Build out our Modal 
         buildOut.call(this);

         //Initialize our event listeners -- to make sure any applicable events get bound
        initializeEvents.call(this);

        /*
         * After adding elements to the DOM, use getComputedStyle
         * to force the browser to recalc and recognize the elements
         * that we just added. This is so that CSS animation has a start point
         */
        window.getComputedStyle(this.modal).height;

        /*
         * Add our open class and check if the modal is taller than the window
         * If so, our anchored class is also applied
         */
        this.modal.className = this.modal.className +
        (this.modal.offsetHeight > window.innerHeight ? "scotch-open scotch-anchored" : " scotch-open");
        this.overlay.className = this.overlay.className + " scotch-open";
    
    }

    //6

    // 3 - Private Methods
      //Utility method to extend defaults with user options 
    function extendDefaults(source, properties){
        var property;
        for (property in properties) {
            // check if property is an internal property 
            if(properties.hasOwnProperty(property)) { 
                source[property] = properties[property];
            }
        }

        return source;
    }
    // 4 - 
    function buildOut() {

        var content, contentHolder , docFrag;

        /*
         * If content is an HTML string, append the HTML string.
         * If content is a domNode, append its content.
         */
        if( typeof this.options.content == "string" ) {
            content = this.options.content;
        } else {
            content = this.options.content.innerHTML;
        }

        //create a DocumentFragment to build with ( DocumentFragment is used to construct collections of DOM elements outside of the DOM)
        docFrag = document.createDocumentFragment(); 

        // Create modal element -- <div class="scotch-modal " > </div>
        this.modal = document.createElement("div");
        this.modal.className = "scotch-modal " + this.options.className;
        this.modal.style.minWidth = this.options.minWidth + "px";
        this.modal.style.maxWidth = this.options.maxWidth + "px";

        // If closeButton option is true, add a close button
        if(this.options.closeButton === true ) {

            this.closeButton = document.createElement("button");
            this.closeButton.className = "scotch-close close-button";
            this.closeButton.innerHTML = "×";
            this.modal.appendChild(this.closeButton);

        }

        // If overlay is true, add one
        if (this.options.overlay === true) {
          this.overlay = document.createElement("div");
          this.overlay.className = "scotch-overlay " + this.options.classname;
          docFrag.appendChild(this.overlay);
        }

        // Create content area and append to modal
        contentHolder = document.createElement("div");
        contentHolder.className = "scotch-content";
        contentHolder.innerHTML = content;
        this.modal.appendChild(contentHolder);

        //Append modal to DocumentFragment
        docFrag.appendChild(this.modal);

        // Append DocumentFragment to body
        document.body.appendChild(docFrag);

    }

    function initializeEvents() {
        //addEventListener passes a callback to the method called "close" -- by using .bind(this) method ensures that our method(close) has the right context when using the this keyword.
        if (this.closeButton) {
          this.closeButton.addEventListener('click', this.close.bind(this));
        }

        if (this.overlay) {
          this.overlay.addEventListener('click', this.close.bind(this));
        }

    }




}());
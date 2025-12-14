/*
    This is a small utility library, used for parsing common URL parameter patterns.
*/

class ActionQueryParser {
    /**  
     * @param {*} actionQueryLayout An action name to action layout mapping.
     *  An action layout is defined as the following object:
     *      {"callback" --> the action to run,
     *       "layout" --> how the string should be parsed (refer below)
     *      }
     *
     *  Say the action to run is: "a b c".
     *  Then, it'll place "b" into a.layout[0]'s div
     *  "c" into a.layout[1]'s div, then call a.callback().
     * 
    */
    constructor(actionQueryLayout) {
        this.layout = actionQueryLayout;
    }

    /**
     * Returns the layout of the specified action. Returns [null]
     * if such an action does not exist.
     */
    getLayout(action) {
        if (!(action in this.layout)) {
            return null;
        }
        return this.layout[action]["layout"];
    }
    
    /**
     * Returns a string of "action action_params..." based on the
     * given layout.
     * 
     * @param {*} action 
     */
    getFullActionQuery(action) {
        if (!(action in this.layout)) {
            console.error("Unknown action in getCurrentActionParams: " + action);
            return;
        }
        let params = this.layout[action]["layout"]
                        .map((div_name) => $(div_name).val());
        return [action, ...params].join(" ");
    }

    /**
     * Runs the callback requested by the action based on the action query string.
     * @param {*} actionQuery The raw query string
     * @param {*} action_on_success An optional function parameter, to be ran if
     *            the query was parsed succesfully.
     */
    handleQuery(actionQuery, action_on_success) {
        let tokens = actionQuery.split(" ");
        if (tokens.length == 0) {
          console.warn("Ignoring unknown action.");
          return;
        }
      
        let action = tokens[0].toLowerCase();
      
        if (!(action in this.layout)) {
          console.warn("Ignoring unknown action.");
          return;
        }
      
        let callback = this.layout[action].callback;
        let layout = this.layout[action].layout;
        
        if (tokens.length - 1 < layout.length) {
          console.warn("Unexpected number of arguments in action. Expected layout: " + layout);
          return;
        }
      
        for (let i = 0; i < layout.length; i++) {
          $(layout[i]).val(tokens[i + 1]);
        }
      
        callback();

        if (action_on_success !== null && action_on_success !== undefined) {
            action_on_success();
        }
    }
}
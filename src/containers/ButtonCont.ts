import { connect, set, inc, nullify } from "../store";
import { Button } from "../components/Button";
import { ISellector } from "../MagicStore/helpers/sellector";

export const ButtonCont = connect(
  (select: ISellector) => ({ count: select`count` }),
  {
    increment: () => {
      set`loading`(true);
      set`other`(10);
      setTimeout(() => {
        console.log(set`title.text`("hello MagicStore !"));
        set`loading`(false);
        set`other`(100);
      }, 5000);
      inc`count`;
    }
  }
)(Button);

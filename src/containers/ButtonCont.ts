import { connect, set, inc, nullify, pipe } from "../store";
import { Button } from "../components/Button";
import { ISellector } from "../MagicStore/helpers/sellector";

export const ButtonCont = connect(
  (select: ISellector) => ({ count: select`count` }),
  {
    increment: () => {
      pipe.set`loading`(true).set`other`(10).inc`count`.run();
      setTimeout(() => {
        pipe.set`title.text`("hello MagicStore !").set`loading`(false)
          .set`other`(100).run();
      }, 5000);
    }
  }
)(Button);

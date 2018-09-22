import { connect, actions } from '../store';
import { Button } from '../components/Button';
import { ISellector } from '../MagicStore/helpers/sellector';

export const ButtonCont = connect(
  (select: ISellector) => ({ count: select`count` }),
  {
    increment: () => {
      actions.set`loading`(true).set`other`(10).inc`count`.run();
      setTimeout(() => {
        actions.set`title.text`('hello MagicStore !').set`loading`(false)
          .set`other`(100).run();
      }, 5000);
    },
  }
)(Button);

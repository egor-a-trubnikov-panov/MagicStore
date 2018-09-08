import { connect } from "../store";
import { ISellector } from "../MagicStore/helpers/sellector";
import { Title } from "../components/Title";

export const TitleCont = connect((select: ISellector) => ({
  text: select.or`title.text`("Helo world"),
  count: select`count`,
  other: select`other`
}))(Title);

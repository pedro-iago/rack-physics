import ReactThreeUtils from './ReactThreeUtils';
import World, {Body, Joint} from '../containers/World';

export const hasRelevantType = function(inst){
  if(ReactThreeUtils.isCompositeComponent(inst)){
    const type = ReactThreeUtils.getComponentOf(inst);
    return (type === World || type === Body || type === Joint);
  }
  else
    return false;
};

const WorldUtils = {
  hasRelevantType
};

export default WorldUtils;

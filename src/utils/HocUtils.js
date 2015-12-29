export const wrapDisplayName = function(Component, hocName){
  let BaseName = '';
  if (typeof Component === 'string') {
    BaseName = Component
  }
  else
    BaseName = Component.displayName || Component.name || 'Component';
  return `${hocName}(${BaseName})`;
}

const HocUtils = {
  wrapDisplayName
};

export default HocUtils;

export const Vec3 = {
  add: (v, u) => ({
      x: v.x + u.x,
      y: v.y + u.y,
      z: v.z + u.z
  }),
  scale: (v, a) => ({
      x: a*v.x,
      y: a*v.y,
      z: a*v.z
  })
};

export const Vec4 = {
  scale: (v, a) => ({
      x: a*v.x,
      y: a*v.y,
      z: a*v.z,
      w: a*v.w
  }),
  toEuler: ({x, y, z, w}) => ({
    x: Math.atan2(2*(x*y + z*w), 1 - 2*(y*y + z*z)),
    y: Math.asin(2*(x*z - w*y)),
    z: Math.atan2(2*(x*w + y*z), 1 - 2*(z*z + w*w))
  })
};

export default {
  Vec3,
  Vec4
}

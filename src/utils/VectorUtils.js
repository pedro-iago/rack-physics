export const Vec3 = {
  add: (v, u) => ({ x: v.x + u.x, y: v.y + u.y, z: v.z + u.z }),
  scale: (v, a) => ({ x: a*v.x, y: a*v.y, z: a*v.z })
};

export const Quat = {
  scale: (q, a) => ({ x: a*q.x, y: a*q.y, z: a*q.z, w: a*q.w }),
  mult: (q1, q2) => ({
    x: q1.x*q2.w + q1.w*q2.x + q1.y*q2.z - q1.z*q2.y,
    y: q1.y*q2.w + q1.w*q2.y + q1.z*q2.x - q1.x*q2.z,
    z: q1.z*q2.w + q1.w*q2.z + q1.x*q2.y - q1.y*q2.x,
    w: q1.w*q2.w - q1.x*q2.x - q1.y*q2.y - q1.z*q2.z,
  }),
  conjugate: (q) => ({ x: -x, y: -y, z: -z, w: w }),
  toEuler: ({x, y, z, w}) => ({
    x: Math.atan2(2*(x*y + z*w), 1 - 2*(y*y + z*z)),
    y: Math.asin(2*(x*z - w*y)),
    z: Math.atan2(2*(x*w + y*z), 1 - 2*(z*z + w*w))
  })
};

export const Pose = {
  translate: Vec3.add,
  rotate3: (v, q) => {
    const pin = {...v, w: 1};
    return Quat.mult( Quat.mult(q, pin), Quat.conjugate(q) );
  }
}

export default { Vec3, Quat, Pose };

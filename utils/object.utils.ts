export function clone(classIns, data) {
    const instance = Object.create(classIns);
    instance.constructor = new classIns().constructor;
    const descriptor = Object.getOwnPropertyDescriptor(instance, 'constructor');
    descriptor.enumerable = false;
    descriptor.writable = false;
    Object.defineProperty(instance, 'constructor', descriptor);
    Object.setPrototypeOf(instance, classIns.prototype);
    Object.assign(instance, data);
    return instance;

}
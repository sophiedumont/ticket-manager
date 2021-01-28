export function schemaToAdminDto(document: any) {
  const schema = document.toObject();
  const returnObject = {};

  returnObject['id'] = schema._id;
  for (const attr in schema) {
    returnObject[attr] = schema[attr];
  }
  delete returnObject['_id'];
  return returnObject;
}

import { ServerResponse } from 'http';
import { requestType } from '../middleware/authentication-user';
import { config } from '../config.js';
import { sendResponse, bodyParser } from '@godgiven/type-server';
import { Database } from '@godgiven/database/json-file.js';
import { validate } from '@godgiven/validator';

const ProfileStorage = new Database({
  name: 'data',
  path: './',
});

type validateKey = keyof typeof validate;

export const pagePublicProfile = async (request: requestType, response: ServerResponse): Promise<void> =>
{
  const params = await bodyParser(request);
  if (params == null)
  {
    response.writeHead(500, { 'Content-Type': 'application/json' });
    response.end();
  }

  const errorList = [];
  const usernameKey: string = config.baseKey;
  const validationList: Record<string, string[]> = {
    ...config.validate.base,
    ...config.validate.publicProfile,
  };

  if (validationList[usernameKey] == null)
  {
    validationList[usernameKey] = ['required'];
  }
  else
  {
    validationList[usernameKey].push('required');
  }

  for (const key in validationList)
  {
    for (const validateKey of validationList[key])
    {
      if (validate[validateKey as validateKey] == null) { continue; }
      if (validate[validateKey as validateKey](params[key]) === true)
      {
        errorList.push(`${key}${validateKey}`);
      }
    }
  }

  if (errorList.length > 0)
  {
    sendResponse(response, 200, {
      ok: false,
      description: '..:: Welcome ::..',
      data: {
        errorList
      },
    });
  }
  try
  {
    await ProfileStorage.insert(
      'profile',
      {
        ...params,
        ...{ accept: false }
      },
      params.phone
    );
    sendResponse(response, 200, {
      ok: true,
      description: '..:: Welcome ::..',
    });
  }
  catch (error)
  {
    errorList.push((error as Error).message);
    sendResponse(response, 200, {
      ok: false,
      description: '..:: Welcome ::..',
      data: {
        errorList
      },
    });
  }
};

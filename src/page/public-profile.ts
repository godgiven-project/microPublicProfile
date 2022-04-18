import { ServerResponse } from 'http';
import { requestType } from '../middleware/authentication-user';
import { config } from '../config.js';
import { sendResponse, bodyParser } from '@godgiven/type-server';
import { Database } from '@godgiven/database/json-file.js';

const ProfileStorage = new Database({
  name: 'data',
  path: './',
});

/**
 *
 */
function validate(_key: string, _value: unknown): boolean
{
  return false;
}

export const pagePublicProfile = async (request: requestType, response: ServerResponse): Promise<void> =>
{
  const params = await bodyParser(request).catch((err) => console.log(err));
  if (params != null)
  {
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
        if (validate(validateKey, params[key]))
        {
          errorList.push(`${key}${validateKey}`);
        }
      }
    }

    if (errorList.length <= 0)
    {
      const save = await ProfileStorage.insert(
        'profile',
        {
          ...params,
          ...{ accept: false }
        },
        params.phone
      );
      if (save === true)
      {
        response.setHeader('Access-Control-Allow-Origin', '*');
        sendResponse(response, 200, {
          ok: true,
          description: '..:: Welcome ::..',
        });
      }
      else
      {
        errorList.push('DataExsist');
        response.setHeader('Access-Control-Allow-Origin', '*');
        sendResponse(response, 200, {
          ok: false,
          description: '..:: Welcome ::..',
          data: {
            errorList
          },
        });
      }
    }
    else
    {
      sendResponse(response, 200, {
        ok: false,
        description: '..:: Welcome ::..',
        data: {
          errorList
        },
      });
    }
  }
  else
  {
    response.writeHead(500, { 'Content-Type': 'application/json' });
    response.end();
  }
};

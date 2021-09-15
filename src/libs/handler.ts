import { Context, APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda'

export function handler<T>(
    lambda: (event: APIGatewayEvent, context: Context) => Promise<T>,
    permission?: string[]
) {
    return async function (
        event: APIGatewayEvent,
        context: Context
    ): Promise<APIGatewayProxyResult> {
        try {
            if (
                permission &&
                event.requestContext.accountId !== 'offlineContext_accountId'
            ) {
                let group = event?.requestContext?.authorizer?.claims['cognito:groups']
                if (typeof group === 'object') group = group[0]
                if (!permission.includes(group)) {
                    // Return 403
                    throw new Error('user not allowed to perform this action')
                }
            }

            const responseBody = await lambda(event, context)
            return {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true
                },
                statusCode: 200,
                body: JSON.stringify(responseBody)
            }
        } catch (e) {
            /* eslint-disable no-console */
            // console.error('Error occurred while processing request.', e)
            /* eslint-enable no-console */

            return {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true
                },
                statusCode: e.status || 500,
                body: JSON.stringify({ error: e.message })
            }
        }
    }
}

export const getUserId = (event: APIGatewayEvent): string => {
    const extention = process.env.IS_OFFLINE && 'DEVELOPER-1'
    const id = event.requestContext.identity.cognitoIdentityId + (extention || '')
    return id || 'SOME-ID' + extention
}

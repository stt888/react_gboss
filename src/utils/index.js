// util function

export function getRedirectPath(type, avatar){
    let path = ''

    // according to user's type to get path
    path += type === 'company' ? '/company' :'/genius'
    // if no avatar photo go to info path
    if(!avatar){
        path += 'info'
    }
    return path
}
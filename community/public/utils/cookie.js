export function setCookie(key, value) {
    document.cookie = `${key}=${value}; path=/; max-age="3600"`;
}
export function getCookie(key) {
    const match = document.cookie.match('(^|;)\\s*' + key + '\\s*=\\s*([^;]+)');
    return match ? match.pop() : null;
}
export function deleteCookie() {
    document.cookie = `id=null; path=/; max-age="0"`;
    document.cookie = `image_path=null; path=/; max-age="0"`;
}
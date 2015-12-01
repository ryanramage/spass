# spass

Session based commandline [supergenpass](http://www.supergenpass.com/)

What does that mean? You enter your masterpassword once, then leave the terminal open. You can keep entering urls.

eg:

```
> spass
Master password: <USER ENTERS PASSWORD HERE>
Enter a URL: <USER ENTERS URL, eg https://mail.google.com>
✓ password copied to clipboard

Enter a URL: <USER ENTERS URL, eg https://twitter.com>
✓ password copied to clipboard

```
On and on. 

spass will shudown if your computer goes to sleep. No passwords are stored in scrollback. That being said, 
this has not been audited, and leaves stuff in memory. If you are super paranoid, dont use this.



```
npm install spass -g
```

## License

MIT

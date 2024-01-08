[user]
	email = jaymeensonara@gmail.com
	name = Jaymeen1712
[alias]
	glist = config --global --list
    showuser = "!echo \"User Name: $(git config --global user.name)\" && echo \"User Email: $(git config --global user.email)\""
    setpersonal = "!git config --global user.email \"jaymeensonara@gmail.com\" && git config --global user.name \"Jaymeen1712\""
    setrapid = "!git config --global user.email \"jaymeen.sonara@rapidops.com\" && git config --global user.name \"Jaymeen Sonara\""
	ac = !git add -A && git commit -n -m
	aca = !git add -A && git commit --amend -n
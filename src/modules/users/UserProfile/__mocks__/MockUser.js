/* @flow */
import type { UserType } from '../../types';

const MockUser: UserType = {
  avatar:
    // eslint-disable-next-line max-len
    'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSIyMjlweCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMTgxIDIyOSIgd2lkdGg9IjE4MXB4IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnNrZXRjaD0iaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PHRpdGxlLz48ZGVzYy8+PGRlZnMvPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiPjxnIGlkPSJzdGFyLXdhcnMtY29weSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEzNjguMDAwMDAwLCAtNTAzLjAwMDAwMCkiPjxnIGlkPSJjaGV3YmFjY2EiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzNjguMDAwMDAwLCA1MDMuMDAwMDAwKSI+PHBhdGggZD0iTTEyOS44MjA2LDE2NS43ODg4IEMxMjkuNDM2NiwxNjcuMjk0OCAxMjguMDg2NiwxNjguMjkwOCAxMjYuNjEwNiwxNjguMjg0OCBMNjIuODA2NiwxNjguMjg0OCBMNTkuODM2NiwxNjguMjg0OCBDNTMuMzk4NiwxNjguMjYwOCA0OC4yMDg2LDE2Mi42NzQ4IDQ4LjIzMjYsMTU2LjE3NjggQzQ4LjI2MjYsMTQ5LjY3ODggNTMuNTAwNiwxNDQuNDM0OCA1OS45Mzg2LDE0NC40NTg4IEM2MC45MTA2LDE0NC40NjQ4IDYxLjkwNjYsMTQ0LjYwODggNjIuODA2NiwxNDQuODM2OCBMMTI2LjYxMDYsMTYxLjUwNDggTDEyNy40NTA2LDE2MS43MjY4IEMxMjkuMjE0NiwxNjIuMTg4OCAxMzAuMjc2NiwxNjQuMDA2OCAxMjkuODIwNiwxNjUuNzg4OCIgZmlsbD0iIzMyMzIzMiIgaWQ9IkZpbGwtMTYxIi8+PHBhdGggZD0iTTkwLjIzMzgsMC40NjA2IEM1MC40NzE4LDAuNDYwNiAxNi4xMjc4LDQ0LjM4MDYgMTMuMzQ5OCw4NS45MTI2IEwwLjIzMzgsMTkyLjQ2MDYgTDE4MC4yMzM4LDE5Mi40NjA2IEwxNjcuMTE3OCw4NS45MTI2IEMxNjQuMzM5OCw0NC4zODA2IDEyOS45OTU4LDAuNDYwNiA5MC4yMzM4LDAuNDYwNiIgZmlsbD0iIzUwM0MxRCIgaWQ9IkZpbGwtMTYyIi8+PHBhdGggZD0iTTEyNi4yMzM4LDc2LjQ2MDggTDEyNi4yMzM4LDc2LjQ2MDggTDE0NC4yMzM4LDUwLjY4NDggTDEwOC4yMzM4LDYzLjU3MjggTDEyNi4yMzM4LDM3Ljc5NjggTDEwMi4yMzM4LDQ0LjI0MDggTDEwOC4yMzM4LDE4LjQ1ODggTDkwLjIzMzgsNDQuMjQwOCBMNzIuMjMzOCwxOC40NTg4IEw3OC4yMzM4LDQ0LjI0MDggTDU0LjIzMzgsMzcuNzk2OCBMNzIuMjMzOCw2My41NzI4IEwzNi4yMzM4LDUwLjY4NDggTDU0LjIzMzgsNzYuNDYwOCBDMzguMTM1OCw3My4wMDQ4IDIyLjc1MTgsODUuMTYwOCAyMS4wMjk4LDEwMi42OTg4IEwxMi4yMzM4LDE5Mi40NTg4IEw5MC4yMzM4LDE5Mi40NTg4IEwxNjguMjMzOCwxOTIuNDU4OCBMMTU5LjQzNzgsMTAyLjY5ODggQzE1Ny43MTU4LDg1LjE2MDggMTQyLjMzMTgsNzMuMDA0OCAxMjYuMjMzOCw3Ni40NjA4IiBmaWxsPSIjQTU3RDUyIiBpZD0iRmlsbC0xNjMiLz48cGF0aCBkPSJNODQuMjMzOCwxMzIuNDYwNiBDNjEuNTQ3OCwxMzIuNDYwNiA1MS4yMzM4LDE1Ni40NjA2IDUxLjIzMzgsMTU2LjQ2MDYgTDEyOS4yMzM4LDE1Ni40NjA2IEMxMjkuMjMzOCwxNTYuNDYwNiAxMjAuNjA1OCwxMzIuNDYwNiA5Ni4yMzM4LDEzMi40NjA2IEw5MC4yMzM4LDEzOC40NjA2IEw4NC4yMzM4LDEzMi40NjA2IFoiIGZpbGw9IiM4QzYyMzkiIGlkPSJGaWxsLTE2NCIvPjxwYXRoIGQ9Ik05MC4yMzM4LDEyNi40NjA2IEw5MC4yMzM4LDE1Ni40NjA2IiBpZD0iU3Ryb2tlLTE2NSIgc3Ryb2tlPSIjQTU3RDUyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS13aWR0aD0iNi43MDgiLz48cGF0aCBkPSJNOTAuMjMzOCwxMTkuMDc2NCBDOTkuNDA3OCwxMTkuMDc2NCAxMDYuODQ3OCwxMjMuNDE0NCAxMDYuODQ3OCwxMjguNzY2NCBDMTA2Ljg0NzgsMTI5LjM4NDQgMTA2LjcyNzgsMTI5Ljk4NDQgMTA2LjUzNTgsMTMwLjU2NjQgQzEwNS43NTU4LDEzMC4zMjA0IDEwNC45Mzk4LDEzMC4xNTI0IDEwNC4wODE4LDEzMC4xNTI0IEM5OS42OTU4LDEzMC4xNTI0IDk2LjE0OTgsMTMzLjU1NDQgOTUuODMxOCwxMzcuODU2NCBDOTQuMDczOCwxMzguMjI4NCA5Mi4yMDc4LDEzOC40NjI0IDkwLjIzMzgsMTM4LjQ2MjQgQzg4LjI1OTgsMTM4LjQ2MjQgODYuMzkzOCwxMzguMjI4NCA4NC42MzU4LDEzNy44NTY0IEM4NC4zMTc4LDEzMy41NTQ0IDgwLjc3MTgsMTMwLjE1MjQgNzYuMzg1OCwxMzAuMTUyNCBDNzUuNTI3OCwxMzAuMTUyNCA3NC43MTE4LDEzMC4zMjA0IDczLjkyNTgsMTMwLjU2NjQgQzczLjczOTgsMTI5Ljk4NDQgNzMuNjE5OCwxMjkuMzg0NCA3My42MTk4LDEyOC43NjY0IEM3My42MTk4LDEyMy40MTQ0IDgxLjA1OTgsMTE5LjA3NjQgOTAuMjMzOCwxMTkuMDc2NCIgZmlsbD0iIzMyMzIzMiIgaWQ9IkZpbGwtMTY2Ii8+PHBhdGggZD0iTTQyLjIzMzgsMTg2LjQ2MDYgTDU0LjIzMzgsMjE2LjQ2MDYgTDY2LjIzMzgsMTk4LjQ2MDYgTDc4LjIzMzgsMjI4LjQ2MDYgTDkwLjIzMzgsMTk4LjQ2MDYgTDEwMi4yMzM4LDIyOC40NjA2IEwxMTQuMjMzOCwxOTguNDYwNiBMMTI2LjIzMzgsMjE2LjQ2MDYgTDEzOC4yMzM4LDE4Ni40NjA2IEw0Mi4yMzM4LDE4Ni40NjA2IFoiIGZpbGw9IiNBNTdENTIiIGlkPSJGaWxsLTE2NyIvPjxwYXRoIGQ9Ik0xMDIuMjMzOCwxMDIuNTkyNiBDMTAyLjIzMzgsMTA5LjE0NDYgMTA3LjU0OTgsMTE0LjQ2MDYgMTE0LjEwMTgsMTE0LjQ2MDYgTDEzOC4yMzM4LDExNC40NjA2IEMxMzguMjMzOCwxMTQuNDYwNiAxMjYuNjI5OCw5MC43MjQ2IDExNC4xMDE4LDkwLjcyNDYgQzEwNy43NTM4LDkwLjcyNDYgMTAyLjIzMzgsOTYuMDQwNiAxMDIuMjMzOCwxMDIuNTkyNiIgZmlsbD0iIzUwM0MxRCIgaWQ9IkZpbGwtMTY4Ii8+PHBhdGggZD0iTTc4LjIzMzgsMTAyLjU5MjYgQzc4LjIzMzgsMTA5LjE0NDYgNzIuOTE3OCwxMTQuNDYwNiA2Ni4zNjU4LDExNC40NjA2IEw0Mi4yMzM4LDExNC40NjA2IEM0Mi4yMzM4LDExNC40NjA2IDUzLjgzNzgsOTAuNzI0NiA2Ni4zNjU4LDkwLjcyNDYgQzcyLjcxMzgsOTAuNzI0NiA3OC4yMzM4LDk2LjA0MDYgNzguMjMzOCwxMDIuNTkyNiIgZmlsbD0iIzUwM0MxRCIgaWQ9IkZpbGwtMTY5Ii8+PHBhdGggZD0iTTExNC4yMzM4LDk3Ljk2MTIgQzExMS43NDM4LDk3Ljk2MTIgMTA5LjczMzgsOTkuOTcxMiAxMDkuNzMzOCwxMDIuNDYxMiBDMTA5LjczMzgsMTA0Ljk1MTIgMTExLjc0MzgsMTA2Ljk2MTIgMTE0LjIzMzgsMTA2Ljk2MTIgQzExNi43MjM4LDEwNi45NjEyIDExOC43MzM4LDEwNC45NTEyIDExOC43MzM4LDEwMi40NjEyIEMxMTguNzMzOCw5OS45NzEyIDExNi43MjM4LDk3Ljk2MTIgMTE0LjIzMzgsOTcuOTYxMiIgZmlsbD0iI0ZGRkZGRiIgaWQ9IkZpbGwtMTcwIi8+PHBhdGggZD0iTTY2LjIzMzgsOTcuOTYxMiBDNjMuNzQzOCw5Ny45NjEyIDYxLjczMzgsOTkuOTcxMiA2MS43MzM4LDEwMi40NjEyIEM2MS43MzM4LDEwNC45NTEyIDYzLjc0MzgsMTA2Ljk2MTIgNjYuMjMzOCwxMDYuOTYxMiBDNjguNzIzOCwxMDYuOTYxMiA3MC43MzM4LDEwNC45NTEyIDcwLjczMzgsMTAyLjQ2MTIgQzcwLjczMzgsOTkuOTcxMiA2OC43MjM4LDk3Ljk2MTIgNjYuMjMzOCw5Ny45NjEyIiBmaWxsPSIjRkZGRkZGIiBpZD0iRmlsbC0xNzEiLz48cGF0aCBkPSJNMTIzLjIzMzgsMTY4LjQ2MTIgTDU3LjIzMzgsMTY4LjQ2MTIgQzUyLjI4MzgsMTY4LjQ2MTIgNDguMjMzOCwxNjQuNDExMiA0OC4yMzM4LDE1OS40NjEyIEM0OC4yMzM4LDE1NC41MTEyIDUyLjI4MzgsMTUwLjQ2MTIgNTcuMjMzOCwxNTAuNDYxMiBMMTIzLjIzMzgsMTUwLjQ2MTIgQzEyOC4xODM4LDE1MC40NjEyIDEzMi4yMzM4LDE1NC41MTEyIDEzMi4yMzM4LDE1OS40NjEyIEwxMzIuMjMzOCwxNTkuNDYxMiBDMTMyLjIzMzgsMTY0LjQxMTIgMTI4LjE4MzgsMTY4LjQ2MTIgMTIzLjIzMzgsMTY4LjQ2MTIiIGZpbGw9IiMzMjMyMzIiIGlkPSJGaWxsLTE3MiIvPjxwYXRoIGQ9Ik02Ni4yMzM4LDE2OC40NjA2IEw3Mi4yMzM4LDE1Ni40NjA2IEw3OC4yMzM4LDE2OC40NjA2IEw2Ni4yMzM4LDE2OC40NjA2IFoiIGZpbGw9IiNGRkZGRkYiIGlkPSJGaWxsLTE3MyIvPjxwYXRoIGQ9Ik0xMDIuMjMzOCwxNjguNDYwNiBMMTA4LjIzMzgsMTU2LjQ2MDYgTDExNC4yMzM4LDE2OC40NjA2IEwxMDIuMjMzOCwxNjguNDYwNiBaIiBmaWxsPSIjRkZGRkZGIiBpZD0iRmlsbC0xNzQiLz48cGF0aCBkPSJNMTI2LjIzMzgsMTUwLjQ2MDYgTDEyMC4yMzM4LDE2Mi40NjA2IEwxMTQuMjMzOCwxNTAuNDYwNiBMMTI2LjIzMzgsMTUwLjQ2MDYgWiIgZmlsbD0iI0ZGRkZGRiIgaWQ9IkZpbGwtMTc1Ii8+PHBhdGggZD0iTTY2LjIzMzgsMTUwLjQ2MDYgTDYwLjIzMzgsMTYyLjQ2MDYgTDU0LjIzMzgsMTUwLjQ2MDYgTDY2LjIzMzgsMTUwLjQ2MDYgWiIgZmlsbD0iI0ZGRkZGRiIgaWQ9IkZpbGwtMTc2Ii8+PC9nPjwvZz48L2c+PC9zdmc+',
  bio:
    // eslint-disable-next-line max-len
    'During his long life Chewbacca has been many things: Wookiee warrior, ace smuggler and rebel hero. Chewie fought with the Republic on Kashyyyk during the Clone Wars, then befriended Han Solo while in Imperial captivity on Mimban. After adventures on Vandor and Kessel, he became Han’s co-pilot aboard the Millennium Falcon, and eventually helped the Alliance restore freedom to the galaxy. Known for his short temper and accuracy with a bowcaster, Chewie also had a big heart – and unflagging loyalty to his friends. He stuck with Han through years of turmoil, and flew the Falcon alongside Rey after the Corellian’s death.',
  displayName: 'Chewbacca',
  ensName: '@Chewie',
  location: 'Kashyyyk',
  website: 'https://github.com/chewie',
};

export default MockUser;

let USERS = null
let timoutBlock = null
let timoutNone = null

const byId = id => document.getElementById(id)

const initUserPage = () => {
  fetchUsers().finally(() => renderUserRows(USERS))
  document
    .getElementById('add-button')
    .addEventListener('click', () => addUser())
}

const getUserTemplate = ({id, firstName, phone}) => {
  let tr = document.createElement('tr')
  tr.setAttribute('id', id)
  tr.innerHTML = `
    <td width="150"><input id='name${id}' value=${firstName} disabled></td>
    <td width="200"><input id='phone${id}' value=${phone} disabled></td>
    <td width="80">
      <button id='edit${id}' class="w-100" onclick=editUserRow(${id})>edit</button>
      <button id='save${id}' class="w-100" style="display: none;" onclick=saveUserRow(${id})>save</button>
    </td>
    <td width="80"><button id='delete${id}' class="w-100" onclick=deleteUserRow(${id})>delete</button></td>
  `
  return tr
}

async function fetchUsers () {
  try {
    const { data: { data } } = await axios.get(`https://reqres.in/api/users`, { params: { page: 1, per_page: 5 } })
    const phone = `+${Math.floor(Math.random() * 10000000)}`

    USERS = data.map(({ first_name, id }) => ({ id, firstName: first_name, phone }))
  } catch (e) { console.error(e) }
}

function renderUserRows (users) {
  if (!users) { return }
  users.forEach(user => byId('users').appendChild(getUserTemplate(user)))
}

function addUser () {
  const firstName = byId('input-name').value
  const phone = byId('input-phone').value
  const id = Date.now()
  const user = { id, firstName, phone }

  if (isValidForm(phone, firstName)) {
    USERS.push(user)
    byId('users').appendChild(getUserTemplate(user))

    getNotification('Added', false)
  }
}

function deleteUserRow (id) {
  byId(id).remove()

  const index = USERS.findIndex(i => i.id === id)
  USERS.splice(index, 1)

  getNotification('Deleted', false)
}

function editUserRow (id) {
  byId(`phone${id}`).removeAttribute('disabled')
  byId(`name${id}`).removeAttribute('disabled')
  byId(`edit${id}`).style.display = 'none'
  byId(`save${id}`).style.display = 'block'
}

function saveUserRow (id) {
  let phone = byId(`phone${id}`)
  let name = byId(`name${id}`)

  if (isValidForm(phone.value, name.value)) {
    phone.setAttribute('disabled', 'true')
    name.setAttribute('disabled', 'true')

    byId(`edit${id}`).style.display = 'block'
    byId(`save${id}`).style.display = 'none'

    const index = USERS.findIndex(i => i.id === id)
    USERS[index] = { id, phone: phone.value, firstName: name.value }

    getNotification('Saved', false)
  }
}

function isValidForm (phone, firstName) {
  const isRequired = (val) => {
    if (!val) { getNotification('Field is required') }
    return !!val
  }
  const isPhone = (val) => {
    const res = !!val.match(/^(\s*)?(\+)?([- ()]?\d[- ()]?){5,14}(\s*)?$/)
    if (!res) { getNotification('Phone number is not correct') }
    return res
  }
  return isRequired(phone) && isPhone(phone) && isRequired(firstName)
}

function getNotification (text, error = true) {
  clearTimeout(timoutBlock)
  clearTimeout(timoutNone)

  const notification = byId('notification')
  notification.innerHTML = text
  notification.style.backgroundColor = error ? 'darkred' : 'green'

  timoutBlock = setTimeout(() => notification.style.display = 'block', 100)
  timoutNone = setTimeout(() => notification.style.display = 'none', 5000)
}

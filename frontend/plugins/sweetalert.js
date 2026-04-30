import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

export default (_context, inject) => {
  inject('swal', Swal)
}

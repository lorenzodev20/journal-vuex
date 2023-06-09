<template>
  <template v-if="entry">
    <div class="entry-title d-flex justify-content-between p-2">
      <div>
        <span class="text-success fs-3 fw-bold"> {{ day }} </span>
        <span class="mx-1 fs-3"> {{ month}} </span>
        <span class="mx-2 fs-4 fw-light"> {{ yearDay}} </span>
      </div>
      <div>
        <button class="btn btn-danger mx-2" v-if="entry.id" @click="onDeleteEntry">
          Borrar
          <i class="fa fa-trash-alt"></i>
        </button>
        <button class="btn btn-primary mx-2">
          Subir foto
          <i class="fa fa-upload"></i>
        </button>
      </div>
    </div>
    <hr />
    <div class="d-flex flex-column px-3 h-75">
      <textarea v-model="entry.text" placeholder="¿Que sucedio hoy?"></textarea>
    </div>
    <img
    src="https://us.123rf.com/450wm/aleksandarnako/aleksandarnako2104/aleksandarnako210400769/167454186-primavera-de-%C3%A1rbol-en-la-ilustraci%C3%B3n-de-la-puesta-de-sol-del-prado-representaci%C3%B3n-3d.jpg?ver=6"
    alt="entry-picture"
    class="img-thumbnail"
    />
  </template>
  <FabButton icon="fa-save" @on:click="saveEntry" />
</template>

<script>
import Swal from 'sweetalert2'
import { defineAsyncComponent } from 'vue'
import { mapActions, mapGetters } from 'vuex'
import getDayMonthYear from '../helpers/getDayMonthYear'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  components: {
    FabButton: defineAsyncComponent(() => import('../components/FabButton.vue'))
  },
  data () {
    return {
      entry: null
    }
  },
  methods: {
    ...mapActions('journal',['updateEntry','createEntry','deleteEntry']),
    loadEntry () {
      let entry;

      if( this.id === 'new' ){
        entry = {
          text: '',
          date: new Date().getTime()
        }
      }else{
        entry = this.getEntriesById(this.id)
        if (!entry) this.$router.push({ name: 'no-entry' })
      }
      this.entry = entry
    },
    async saveEntry(){
      new Swal({
        title:'Espere por favor',
        allowOutsideClick: false
      })
      Swal.showLoading()

      if( this.entry.id){
        await this.updateEntry(this.entry)
      }else{
        const id = await this.createEntry(this.entry)
        this.$router.push({name:'entry', params:{ id }})
      }

      Swal.fire('Guardando','Entrada registrada con exito','success')
    },
    async onDeleteEntry(){
      const { isConfirmed } = await Swal.fire({
        title:'¿Esta seguro?',
        text:'Una vez borrado, no se puede recuperar',
        showDenyButton:true,
        confirmButtonText:'Sí, estoy seguro'
      })

      if( isConfirmed ){
        new Swal({
          title:'Espere por favor',
          allowOutsideClick: false
        })
        Swal.showLoading()
        // Extraer el ID
        const { id } = this.entry
        // Llamar a la acction
        await this.deleteEntry(id)
        // Redireccionar al entry
        this.$router.push({name:'no-entry'})
        Swal.fire('Eliminado','','success')
      }
    }
  },
  computed: {
    ...mapGetters('journal', ['getEntriesById']),
    day () {
      const { day } = getDayMonthYear(this.entry.date)
      return day
    },
    month(){
      const { month } = getDayMonthYear(this.entry.date)
      return month
    },
    yearDay(){
      const { yearDay } = getDayMonthYear(this.entry.date)
      return yearDay
    }
  },
  created () {
    this.loadEntry()
  },
  watch:{
    id(){
      this.loadEntry()
    }
  }
}
</script>

<style lang="scss" scoped>
textarea {
  font-size: 20px;
  border: none;
  height: 100%;

  &:focus {
    outline: none;
  }
}
img {
  width: 200px;
  position: fixed;
  bottom: 150px;
  right: 20px;
  box-shadow: 0px 5px 10px rgba($color: #000000, $alpha: 0.2);
}
</style>

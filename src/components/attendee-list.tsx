import {Search, MoreHorizontal, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight} from 'lucide-react'
import {IconButton} from './icon-button'
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";
import { Table } from './Table/table'
import { TableHeader } from './Table/table-header'
import { TableCell } from './Table/table-cell'
import { TableRow } from './Table/table-row'
import { ChangeEvent, useEffect, useState } from 'react';

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

interface Attendees{
    id: string,
    name: string,
    email: string,
    createdAt: string,
    checkedInAt: string
}
export function AttendeeList(){

    const [attendees, setAttendees]=useState<Attendees[]>([]);
    const [total,setTotal]=useState(0);

    const [page,setPage]=useState(()=>{
        const url=new URL(window.location.toString());
        if(url.searchParams.has('page')){
            return Number(url.searchParams.get('page')); 
        }
        return 1;
    });
    
    const [search,setSearch]=useState(()=>{
        const url=new URL(window.location.toString());
        if(url.searchParams.has('search')){
            return url.searchParams.get('search') ?? ''; 
        }
        return '';
});

useEffect(()=>{

    const url=new URL('http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees');
    
    url.searchParams.set('pageIndex',String(page-1))

  if(search.length>0){
    url.searchParams.set('query',search);
  }

    fetch(url)
    .then(response=>response.json())
    .then(data => {
        setAttendees(data.attendees);
        setTotal(data.total)
    })
},[page,search])

function SetCurrentPage(page:number){

    const url=new URL(window.location.toString());
        
        url.searchParams.set('page',String(page));

        window.history.pushState({},"",url);
     setPage(page)
}

function SetCurrentSearch(search:string){

    const url=new URL(window.location.toString());
        
    url.searchParams.set('search',search);

    window.history.pushState({},"",url);
        setSearch(search)
}

const TotalPage=Math.ceil(total/10);
    function handleGoToNextPage(){
        SetCurrentPage(page+1);
        
    }
    
    function handleGoToPrevPage(){
        SetCurrentPage(page-1);
    }

    function handleGoToFirstPage(){
        SetCurrentPage(1);
    }

    function handleGoToLastPage(){
        SetCurrentPage(TotalPage);
    }
    function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>)
    {
        SetCurrentSearch(event.target.value);
        SetCurrentPage(1);
    }


    return (
    <div className='flex flex-col gap-4'>
        <div className="flex gap-5 items-center">
        <h1 className="text-2xl font-bold">Participantes</h1>
        <div className="px-3 w-72 py-1.5 border border-white/10 rounded-lg text-sm flex items-center gap-3">
        <Search className='size-4 text-emerald-300'/>
        <input 
        onChange={onSearchInputChanged}
        value={search}  
        className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0" 
        type="search" 
        placeholder="Buscar Participantes..."
        />
        </div>
        
        </div>
        
        <Table>
            <thead>
                <tr className='border-b border-white/10'>
                    <TableHeader style={{width:48}}> 
                    <input className='bg-white/20 rounded border border-white/10 size-4' type="checkbox"/>
                    </TableHeader>
                    <TableHeader>Código</TableHeader>
                    <TableHeader>Participantes</TableHeader>
                    <TableHeader>Data de Inscrição</TableHeader>
                    <TableHeader>Data do check-in</TableHeader>
                    <TableHeader style={{width:64}}></TableHeader>
                </tr>
            </thead>
            <tbody>
            {attendees.map((attendee)=>{
                return(
                    <TableRow key={attendee.id} >
                    <TableCell><input className='bg-white/20 rounded border border-white/10 size-4' type="checkbox"/></TableCell>
                    <TableCell>{attendee.id}</TableCell>
                    <TableCell>
                        <div className='flex flex-col gap-1'>
                            <span className='font-semibold text-white'>{attendee.name}</span>
                            <span className='text-sm text-zinc-400'>{attendee.email}</span>
                        </div>
                    </TableCell>
                    <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
                    <TableCell>
                        {
                            attendee.checkedInAt 
                            ? <span className='text-zinc-400'>Sem Check-In</span> 
                            : 
                            dayjs().to(attendee.checkedInAt)
                        }

                    </TableCell>
                    <TableCell>
                        <IconButton transparent>
                        <MoreHorizontal className='size-4'/>
                        </IconButton>
                    </TableCell>
                </TableRow>
                )
            })}
            </tbody>
            <tfoot>
                <tr>
                    <TableCell colSpan={3}>
                        Mostrando {attendees.length} de {total}
                    </TableCell>
                    <TableCell className='text-right' colSpan={3}>
                    <div className='inline-flex items-center gap-8'>
                            <span> Página {page} de {TotalPage}</span>
                    <div className='flex gap-1.5'>

                        <IconButton onClick={handleGoToFirstPage} disabled={page===1}>
                        <ChevronsLeft className='size-4'/>
                        </IconButton>

                        <IconButton onClick={handleGoToPrevPage} disabled={page===1}>
                        <ChevronLeft className='size-4'/>
                        </IconButton>

                        <IconButton  onClick={handleGoToNextPage} disabled={page===TotalPage}>
                        <ChevronRight className='size-4'/>
                        </IconButton>

                        <IconButton onClick={handleGoToLastPage} disabled={page===TotalPage}>
                        <ChevronsRight className='size-4'/>
                        </IconButton>
                        </div>

                    </div>
                    </TableCell>
                </tr>
            </tfoot>
            </Table>
    </div>
    )
}
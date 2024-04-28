import nlwUniteIcon from '../assets/nlw-unite-icon.svg';
import { NavLink } from './nav-link';
export function Header(){
    return (
        <div className='flex items-center gap-5 py-8'>
            <img src={nlwUniteIcon} title='this is image from event'/>
            <nav className='flex items-center gap-5'>
            <NavLink href='/events'>Event</NavLink>
            <NavLink href='/participantes'>Participantes</NavLink>
            </nav>
        </div>
    )
}